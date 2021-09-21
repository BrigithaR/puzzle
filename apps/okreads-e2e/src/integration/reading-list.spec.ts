describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });

  it('Then: I should undo the added book from reading list',()=>{
    cy.get('input[type="search"]').type('java');

    cy.get('form').submit();

    cy.contains('Effective Java');
    
    cy.contains('Want to Read').click();
    
    cy.contains('Undo').click().should('be.enabled','Want to Read');
   });
});
