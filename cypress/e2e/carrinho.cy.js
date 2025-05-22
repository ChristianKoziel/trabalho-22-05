describe('Teste de Carrinho - E-commerce', () => {

  beforeEach(() => {
    cy.visit('http://localhost:8080'); 
  });

  it('Adiciona produto ao carrinho e verifica cookie, localStorage e persistência', () => {
    cy.get('#btn-add').click();

    cy.getCookie('carrinho_token').should('exist')
      .and((cookie) => {
        expect(cookie.value).to.equal('carrinho456');
      });


    cy.window().then((win) => {
      const itens = JSON.parse(win.localStorage.getItem('itens_carrinho'));
      expect(itens).to.include('Livro de Cypress');
    });

    cy.reload();
    cy.contains('Carrinho com 1 item(ns).');
  });

  it('Reconhece carrinho ativo com cookie e localStorage definidos manualmente', () => {
    cy.setCookie('carrinho_token', 'carrinho456');

    cy.window().then((win) => {
      win.localStorage.setItem('itens_carrinho', JSON.stringify(['Livro de Cypress']));
    });

    cy.reload();

    cy.contains('Carrinho com 1 item(ns).');
  });

});
