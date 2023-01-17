
import { ListParticipationsForCrowdActionQuery } from "../query";
import { CQRSModule } from "@common/cqrs";
import {  ICommitmentOptionRepository } from "@domain/commitmentoption";
import { CrowdActionCategoryEnum, CrowdActionTypeEnum, ICrowdActionRepository } from "@domain/crowdaction";
import { CommitmentOptionPersistence, CommitmentOptionRepository, CommitmentOptionSchema, CrowdActionPersistence, CrowdActionRepository, CrowdActionSchema, ParticipationPersistence, ParticipationSchema, ProfileSchema } from "@infrastructure/mongo";
import { CrowdActionService } from "@modules/crowdaction/service";
import { getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Connection, Model,connect } from "mongoose";
import { CreateCrowdActionDto } from "@infrastructure/crowdaction";
import { CreateProfileCommand } from "@modules/profile/cqrs";
import { CreateProfileDto } from "@infrastructure/profile";
import { IProfileRepository } from "@domain/profile";
import { ProfileRepository } from "@infrastructure/mongo/repository/profile.repository";
import { CreateParticipation, IParticipationRepository } from "@domain/participation";
import { ParticipationRepository } from "@infrastructure/mongo";
import { CreateCrowdActionCommand } from "@modules/crowdaction";
import { SchedulerService } from "@modules/scheduler";
import { SchedulerRegistry } from "@nestjs/schedule";
import { ProfilePersistence } from "@infrastructure/mongo";
import { ProfileService } from "@modules/profile";
import { GetCommitmentOptionsByType } from "@modules/commitmentoption";


describe('GetParticipationForCrowdActionQuery',()=>{
    let listParticipationsForCrowdActionQuery: ListParticipationsForCrowdActionQuery
    let createCrowdActionCommand: CreateCrowdActionCommand;
    let createProfileCommand: CreateProfileCommand;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let crowdactionModel: Model<CrowdActionPersistence>;
    let commitmentOptionModel: Model<CommitmentOptionPersistence>;
    let profileModel: Model<ProfilePersistence>;
    let participationModel: Model<ParticipationPersistence>;

    

     let participationRepository: IParticipationRepository;




    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        profileModel = mongoConnection.model(ProfilePersistence.name, ProfileSchema);
        participationModel = mongoConnection.model<ParticipationPersistence>(ParticipationPersistence.name, ParticipationSchema);


        crowdactionModel = mongoConnection.model<CrowdActionPersistence>(CrowdActionPersistence.name, CrowdActionSchema);
        commitmentOptionModel = mongoConnection.model<CommitmentOptionPersistence>(CommitmentOptionPersistence.name, CommitmentOptionSchema);
        const moduleRef = await Test.createTestingModule({
            imports: [CQRSModule],
            providers: [
                ListParticipationsForCrowdActionQuery,
                CreateCrowdActionCommand,
                CreateProfileCommand,
                GetCommitmentOptionsByType,
                SchedulerService,
                SchedulerRegistry,
                ProfileService,
                { provide:IParticipationRepository,useClass:ParticipationRepository},
                { provide: ICrowdActionRepository, useClass: CrowdActionRepository },
                { provide: ICommitmentOptionRepository, useClass: CommitmentOptionRepository },
                {provide: IProfileRepository, useClass: ProfileRepository},
                { provide: getModelToken(CrowdActionPersistence.name), useValue: crowdactionModel },
                { provide: getModelToken(CommitmentOptionPersistence.name), useValue: commitmentOptionModel },
                { provide: getModelToken(ProfilePersistence.name), useValue: profileModel},
                { provide: getModelToken(ParticipationPersistence.name),useValue: participationModel},
                {provide: CrowdActionService.name, useClass: CrowdActionService},                
    ]
        }).compile();
        listParticipationsForCrowdActionQuery = moduleRef.get<ListParticipationsForCrowdActionQuery>(ListParticipationsForCrowdActionQuery);
        createCrowdActionCommand = moduleRef.get<CreateCrowdActionCommand>(CreateCrowdActionCommand);
        createProfileCommand = moduleRef.get<CreateProfileCommand>(CreateProfileCommand);
        participationRepository = moduleRef.get<IParticipationRepository>(IParticipationRepository);


    });
    afterAll(async () => {
        const collections = mongoConnection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
        createCrowdActionCommand.stopAllCrons();
        await mongoConnection.dropDatabase();
        await mongoConnection.close();
        await mongod.stop();
    });

    
    it('should be defined',()=>{
        expect(listParticipationsForCrowdActionQuery).toBeDefined();
        expect(createCrowdActionCommand).toBeDefined(); 
        expect(createProfileCommand).toBeDefined(); 
    })
    describe('handle',()=>{
        const length = 5;
        const page = 1;
        const pageSize = 20;
        const crowdactionsRelatedTo1:any = [];
        const crowdactionsRelatedTo2:any = [];
        let profileId;
        let profileId2;
        it('should return the participation based on the filter, filtering by userId',async ()=>{
            /****Create User 1 */
            profileId = await createProfileCommand.execute(CreateProfileStub);
            expect(profileId).toBeDefined();

            /****Creates User 2 */
            profileId2 = await createProfileCommand.execute({...CreateProfileStub,userId:'2'});
            expect(profileId2).toBeDefined();
            /***Creates a number of crowdAction and participations related to user 1 */
            for(let i = 0; i < length; i++){
                const crowdAction = await createCrowdActionCommand.execute(CrowdActionStub);
                crowdactionsRelatedTo1.push(crowdAction);
                await participationRepository.create({...ParticipationStub,userId:profileId,crowdActionId:crowdAction.id});

            }
            /***Creates a number of crowdActions and participations related to user 2 */
            for(let i = 0; i < length; i++){
                const crowdAction = await createCrowdActionCommand.execute(CrowdActionStub);
                crowdactionsRelatedTo2.push(crowdAction);
                await participationRepository.create({...ParticipationStub,userId:profileId2,crowdActionId:crowdAction.id});

            }

            
            const response = await listParticipationsForCrowdActionQuery.handle({page:page,pageSize:pageSize,filter:{userId:profileId}});
            expect(response).toBeDefined();
            expect(response.items.length).toEqual(length);
            response.items.forEach((element,index) => {
                expect(element.userId).toEqual(profileId);
                expect(element.crowdActionId).toEqual(crowdactionsRelatedTo1[index].id);
            });
            
            const response2 = await listParticipationsForCrowdActionQuery.handle({page:page,pageSize:pageSize,filter:{userId:profileId2}});
            expect(response2).toBeDefined();
            expect(response2.items.length).toEqual(length);
            response2.items.forEach((element,index) => {
                expect(element.userId).toEqual(profileId2);
                expect(element.crowdActionId).toEqual(crowdactionsRelatedTo2[index].id);
            });
        
            

        })

        it('it should filter participation by crowdActionId',async ()=>{
           
            const response3 = await listParticipationsForCrowdActionQuery.handle({page:page,pageSize:pageSize,filter:{crowdActionId:crowdactionsRelatedTo1[0].id}});
            expect(response3).toBeDefined();
            expect(response3.items.length).toEqual(1);
            expect(response3.items[0].userId).toEqual(profileId);
            expect(response3.items[0].crowdActionId).toEqual(crowdactionsRelatedTo1[0].id);

            const response4 = await listParticipationsForCrowdActionQuery.handle({page:page,pageSize:pageSize,filter:{crowdActionId:crowdactionsRelatedTo2[0].id}});
            expect(response4).toBeDefined();
            expect(response4.items.length).toEqual(1);
            expect(response4.items[0].userId).toEqual(profileId2);
            expect(response4.items[0].crowdActionId).toEqual(crowdactionsRelatedTo2[0].id);
            
            await participationRepository.create({...ParticipationStub,userId:profileId,crowdActionId:crowdactionsRelatedTo2[0].id});
            const response5 = await listParticipationsForCrowdActionQuery.handle({page:1,pageSize:20,filter:{crowdActionId:crowdactionsRelatedTo2[0].id}});
            expect(response5).toBeDefined();
            expect(response5.items.length).toEqual(2);
            expect(response5.items[0].userId).toEqual(profileId2);
            expect(response5.items[0].crowdActionId).toEqual(crowdactionsRelatedTo2[0].id);
        })
        it('should return empty array if it finds no result',async ()=>{
            const fakeId = "5f9f1c5b1b8fd99435971f"
            const repsonse6 = await listParticipationsForCrowdActionQuery.handle({page:page,pageSize:pageSize,filter:{userId:fakeId}});
            expect(repsonse6).toBeDefined();
            expect(repsonse6.items.length).toEqual(0);

            const response7 = await listParticipationsForCrowdActionQuery.handle({page:page,pageSize:pageSize,filter:{crowdActionId:fakeId}});
            expect(response7).toBeDefined();
            expect(response7.items.length).toEqual(0);
        })

    })
})

const CrowdActionStub : CreateCrowdActionDto = {
    type: CrowdActionTypeEnum.FOOD,
    title: 'Crowdaction title',
    description: 'Crowdaction description',
    category: CrowdActionCategoryEnum.FOOD,
    subcategory: CrowdActionCategoryEnum.SUSTAINABILITY,
    country: 'TG',
    password: 'pa$$w0rd',
    startAt: new Date('01/01/2025'),
    endAt: new Date('08/01/2025'),
    joinEndAt: new Date('07/01/2025'),
    badges: [
    ],
    
}
const CreateProfileStub: CreateProfileDto={
    userId: '5f9f1c5b1b8fd99435971f',
    firstName: 'John',
    lastName: 'Doe',
    bio:'I am a cool guy',
    country: 'TG',
}
const ParticipationStub: CreateParticipation = {
    userId: 'fakeId',
    crowdActionId:'fakeCrowdActionId',
    commitmentOptions:[],
    fullName:'Full Name',
    joinDate: new Date(),
    dailyCheckIns:1,
    avatar:undefined


}

