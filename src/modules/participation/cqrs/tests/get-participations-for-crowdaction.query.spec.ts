
import { GetParticipationForCrowdactionQuery } from "../query";
import { CQRSModule } from "@common/cqrs";
import {  ICommitmentOptionRepository } from "@domain/commitmentoption";
import { CrowdActionCategoryEnum, CrowdActionTypeEnum, ICrowdActionRepository } from "@domain/crowdaction";
import { CommitmentOptionPersistence, CommitmentOptionRepository, CommitmentOptionSchema, CrowdActionPersistence, CrowdActionRepository, CrowdActionSchema, ParticipationPersistence, ProfileSchema } from "@infrastructure/mongo";
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
import { ParticipationSchema } from "@infrastructure/mongo";
import { GetCommitmentOptionsByType } from "@modules/commitmentoption";
import { UserIsNotParticipatingError } from "@modules/participation/error";

describe('GetParticipationForCrowdActionQuery',()=>{
    let getParticipationForCrowdActionqQuery: GetParticipationForCrowdactionQuery;
    let createCrowdActionCommand: CreateCrowdActionCommand;
    let createProfileCommand: CreateProfileCommand;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let crowdactionModel: Model<CrowdActionPersistence>;
    let commitmentOptionModel: Model<CommitmentOptionPersistence>;
    let participationModel: Model<ParticipationPersistence>;
    let profileModel: Model<ProfilePersistence>;
    

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
                GetParticipationForCrowdactionQuery,
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
                { provide: getModelToken(ParticipationPersistence.name),useValue: participationModel},
                { provide: getModelToken(ProfilePersistence.name), useValue: profileModel},
                {provide: CrowdActionService.name, useClass: CrowdActionService},                
    ]
        }).compile();
        getParticipationForCrowdActionqQuery = moduleRef.get<GetParticipationForCrowdactionQuery>(GetParticipationForCrowdactionQuery);
        createCrowdActionCommand = moduleRef.get<CreateCrowdActionCommand>(CreateCrowdActionCommand);
        createProfileCommand = moduleRef.get<CreateProfileCommand>(CreateProfileCommand);
        participationRepository = moduleRef.get<IParticipationRepository>(IParticipationRepository);


    });
    afterAll(async () => {
        createCrowdActionCommand.stopAllCrons();
        await mongoConnection.dropDatabase();
        await mongoConnection.close();
        await mongod.stop();
    });

    afterEach(async () => {
        const collections = mongoConnection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    });
    it('should be defined',()=>{
        expect(getParticipationForCrowdActionqQuery).toBeDefined();
        expect(createCrowdActionCommand).toBeDefined(); 
        expect(createProfileCommand).toBeDefined(); 
    })
    describe('handle',()=>{
        
        let profileId;
        it('should return the participation with respect to userId and crowdActionId',async ()=>{
            /***Create CrowdAction */
            const crowdAction = await createCrowdActionCommand.execute(CrowdActionStub);
            expect(crowdAction).toBeDefined();
            /***Create a user */
            profileId = await createProfileCommand.execute(CreateProfileStub);
            expect(profileId).toBeDefined();
            /****Create Conneciton between the user and the CrowdAction */
            
            await participationRepository.create({...ParticipationStub,userId:profileId,crowdActionId:crowdAction.id});
            const response = await getParticipationForCrowdActionqQuery.handle({userId:profileId,crowdActionId:crowdAction.id});
            expect(response).toBeDefined();
            
        
            expect(response).toEqual(
                {...ParticipationStub,
                    userId:profileId,
                    crowdActionId:crowdAction.id,
                     id:response.id
                });
        })

        it('it should throw UserIsNotParticipating Error if user is not participating in the crowdAction',async ()=>{
           
            let crowdAction2;
            try{
                crowdAction2 = await createCrowdActionCommand.execute(CrowdActionStub);
                await getParticipationForCrowdActionqQuery.handle({userId:profileId,crowdActionId:crowdAction2.id});


                fail('Should have thrown an error');
            }catch(e){
                expect(e.message).toEqual(new UserIsNotParticipatingError(crowdAction2?.id).message);
                
            }
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

