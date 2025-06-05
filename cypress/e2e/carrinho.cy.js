describe('Testes da aplicação MyPreferencesApp', () => {
  const baseUrl = 'http://127.0.0.1:5500/Backup'; // URL do GoLive

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('1. Login com usuário e senha válidos', () => {
    cy.visit(`${baseUrl}/index.html`);

    cy.get('#username').type('admin');
    cy.get('#password').type('admin123');
    cy.get('#loginBtn').click();

    cy.url().should('include', '/dashboard.html');
    cy.contains('Bem-vindo, admin!').should('be.visible');
  });

  it('2. Verifica se o cookie de sessão foi criado após login', () => {
    cy.visit(`${baseUrl}/index.html`);
    cy.get('#username').type('admin');
    cy.get('#password').type('admin123');
    cy.get('#loginBtn').click();

    cy.getCookie('session_id').should('exist').and('have.property', 'value', 'abc123');
  });

  it('3. Alternar tema e verificar persistência no localStorage', () => {
    // Passo extra: fazer login antes para garantir acesso ao dashboard
    cy.visit(`${baseUrl}/index.html`);
    cy.get('#username').type('admin');
    cy.get('#password').type('admin123');
    cy.get('#loginBtn').click();

    // Agora estamos no dashboard, alterna tema
    cy.get('#toggleTheme').click();

    cy.window().then((win) => {
      expect(win.localStorage.getItem('theme')).to.eq('dark');
    });

    cy.reload();
    cy.get('body').should('have.class', 'dark');
  });

  it('4. Verifica navegação entre abas: Perfil e Configurações', () => {
    cy.visit(`${baseUrl}/index.html`);
    cy.get('#username').type('admin');
    cy.get('#password').type('admin123');
    cy.get('#loginBtn').click();

    cy.get('#perfilBtn').click();
    cy.contains('Nome: admin').should('be.visible');

    cy.get('#configBtn').click();
    cy.contains('Preferências do usuário').should('be.visible');
  });

  it('5. Logout deve apagar cookie e redirecionar para login', () => {
    cy.visit(`${baseUrl}/index.html`);
    cy.get('#username').type('admin');
    cy.get('#password').type('admin123');
    cy.get('#loginBtn').click();

    cy.get('#logoutBtn').click();

    cy.url().should('include', '/index.html');
    cy.getCookie('session_id').should('not.exist');
  });
});
