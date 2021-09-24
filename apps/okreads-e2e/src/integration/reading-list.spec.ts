describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should be able to mark the book as finished',()=>{

    cy.get('[data-testing="toggle-reading-list"]').click();
    cy.get('body').then((body) => {
      if (body.find('[data-testing="removebutton"]').length > 0) {
        cy.get('[data-testing="removebutton"]').each(($el) => {
          cy.wrap($el).click();
        });
      }
    });
    cy.get('[data-testing="close-reading-list"]').click();

    cy.wait(1000);
   
    cy.get('input[type="search"]').type('python');
  
      cy.get('form').submit();
  
      cy.get('[data-testing="want-to-read-button"]').first().click();

      cy.get('[data-testing="toggle-reading-list"]').click();

      cy.wait(1000);
       
      cy.get('[data-testing="finishbutton"]').click();
 
      cy.wait(2000);

      cy.get('[data-testing="bookfinishedbutton"]').should('be.enabled')

  });
   
});


