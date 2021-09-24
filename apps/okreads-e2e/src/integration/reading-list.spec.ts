describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should undo the added book from reading list',()=>{
    cy.get('[data-testing="toggle-reading-list"]').click();
    cy.get('body').then((body) => {
      if (body.find('[data-testing="removebutton"]').length > 0) {
        cy.get('[data-testing="removebutton"]').each(($el) => {
          cy.wrap($el).click();
        });
      }
    });
    cy.get('[data-testing="close-reading-list"]').click();
    cy.get('input[type="search"]').type('java');

    cy.get('form').submit();

    cy.get('[data-testing="want-to-read-button"]').first().click();

    cy.wait(2000);

    cy.contains('Undo').click();

    cy.get('[data-testing="reading-item"]').should('have.length', 0);
   });
});
