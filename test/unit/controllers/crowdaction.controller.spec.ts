import { CrowdActionController } from '@api/rest/crowdactions';

describe('CrowdActionController', () => {
    let cController: CrowdActionController;

    beforeEach(() => {
        cController = new CrowdActionController();
    });

    describe('get', () => {
        it('should return Hello World!', async () => {
            const result = 'Hello World!';
            jest.spyOn(cController, 'getCrowdActions').mockImplementation(async () => result);
            expect(await cController.getCrowdActions()).toBe(result);
        });
    });
});
