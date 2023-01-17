import { CQRSModule, ICQRSHandler } from "@common/cqrs";
import { AwardTypeEnum, BadgeTierEnum } from "@domain/badge";
import { CommitmentOption } from "@domain/commitmentoption";
import { CommitmentOptionIconEnum } from "@domain/commitmentoption/enum/commitmentoption.enum";
import { CrowdAction, CrowdActionCategoryEnum, CrowdActionJoinStatusEnum, CrowdActionStatusEnum, CrowdActionTypeEnum } from "@domain/crowdaction";
import { GetCommitmentOptionsByType } from "@modules/commitmentoption";
import { CrowdActionService } from "@modules/crowdaction/service";
import { Test } from "@nestjs/testing";
import { FindCrowdActionByIdQuery } from "../query";

describe('FindCrowdActionByIdQuery',()=>{
    let findCrowdActionByIdQuery: FindCrowdActionByIdQuery;
    let crowdActionService: CrowdActionService;
    let  _ICQRSHandler: ICQRSHandler;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [CQRSModule],
            providers: [
                FindCrowdActionByIdQuery,
            { provide: CrowdActionService.name, useValue:{
                findByIdOrFail: jest.fn(),
            }},
            {
            provide:ICQRSHandler.name, useValue: {
                handle: jest.fn(),
                fetch: jest.fn()
            }},

    ]
        }).compile();
        findCrowdActionByIdQuery = moduleRef.get<FindCrowdActionByIdQuery>(FindCrowdActionByIdQuery);
        crowdActionService = moduleRef.get<CrowdActionService>(CrowdActionService.name);
        _ICQRSHandler = moduleRef.get<ICQRSHandler>(ICQRSHandler);
    });
  
    describe('handle',()=>{
        it('should return a crowdaction by Id',async ()=>{
            jest.spyOn(_ICQRSHandler,'fetch').mockResolvedValueOnce([CommitmentOptionStub]);
            const mockStaticFunction = jest.fn(x=>x);
            CrowdAction.create = mockStaticFunction;

            const respone = await findCrowdActionByIdQuery.handle('1');
            expect(respone).toBeDefined();
            expect(crowdActionService.findByIdOrFail).toBeCalledWith('1');
            expect(_ICQRSHandler.fetch).toBeCalledWith(GetCommitmentOptionsByType, CrowdActionStub.type);
            expect(CrowdAction.create).toBeCalledWith({...CrowdActionStub, commitmentOptions: [CommitmentOptionStub]});

        })
    })
})

const CrowdActionStub : CrowdAction = {
    id: '1',
    type: CrowdActionTypeEnum.FOOD,
    title: 'Crowdaction title',
    description: 'Crowdaction description',
    category: CrowdActionCategoryEnum.FOOD,
    subcategory: CrowdActionCategoryEnum.SUSTAINABILITY,
    location: { name: 'location name', code: '2001' },
    slug: 'crowdaction-title',
    password: 'pa$$w0rd',
    startAt: new Date('01/01/2025'),
    endAt: new Date('08/01/2025'),
    joinEndAt: new Date('07/01/2025'),
    badges: [
        {
            tier: BadgeTierEnum.BRONZE,
            awardType: AwardTypeEnum.ALL,
            minimumCheckIns: 12,
        },
    ],
    participantCount: 0,
    images:  {
        "card": "https://www.example.com/image.png",
        "banner": "https://www.example.com/image.png"
      },
    commitmentOptions: [],
    status:CrowdActionStatusEnum.STARTED ,
    joinStatus: CrowdActionJoinStatusEnum.OPEN,
    createdAt: new Date('01/01/2025'),
    updatedAt:  new Date('07/01/2025'),
    updateStatuses: function (): any {
        return;
    }
    
}

const CommitmentOptionStub: CommitmentOption = {
    id: '1',
    type: CrowdActionTypeEnum.FOOD,
    label: 'label',
    points: 1,
    icon: CommitmentOptionIconEnum.no_beef,
    createdAt: new Date('01/01/2025'),
    updatedAt: new Date('07/01/2025')
}