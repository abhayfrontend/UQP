import { UQP } from './app.po';

describe('UQP App', function() {
  let page: UQP;

  beforeEach(() => {
    page = new UQP();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
