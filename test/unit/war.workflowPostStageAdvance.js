import handler from '../../src/handler';

describe('Event workflowPostStageAdvance', () => {
  describe('Handler function', () => {
    beforeEach(() => {
      spy(handler);
      handler();
    });

    it('should have been run once', () => {
      expect(handler).to.have.been.calledOnce;
    });
  });
});
