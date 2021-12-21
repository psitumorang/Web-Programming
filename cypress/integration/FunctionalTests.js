describe('login', () => {
  it('login successfully', () => {
    cy.visit('http://localhost:3000');
    cy.get('#username').type('stacey');
    cy.get('#password').type("1");
    cy.get('#loginButton').click();
    cy.get('#forMessages').should('be.visible');
  })

  it('unsuccessful login', () => {
    cy.visit('http://localhost:3000');
    cy.get('#username').type('stacey');
    cy.get('#password').type("34");
    cy.get('#loginButton').click();
    cy.get('#loginButton').should('be.visible');
  })
})

describe('registration', () => {

  it('try registering existing user', () => {

    cy.visit('http://localhost:3000');
    cy.get('#registrationLink').click();
    cy.get('#username').type("stacey");
    cy.get('#password1').type("1");
    cy.get('#password2').type("1");
    cy.get('#createButton').click();
    cy.wait(3000);
    cy.get('#createButton').should('be.visible');
  })

  it('register new user', () => {

    const ranNum = Math.random() * 1000000
    const newUser = `lksjfdso${ranNum}`;
    cy.visit('http://localhost:3000');
    cy.get('#registrationLink').click();
    cy.get('#username').type(newUser);
    cy.get('#password1').type("1");
    cy.get('#password2').type("1");
    cy.get('#createButton').click();
    cy.wait(2000);
    cy.get('#username').type(newUser);
    cy.get('#password').type("1");
    cy.wait(1000);
    cy.get('#loginButton').click();
    cy.get('#forMessages').should('be.visible');
    cy.get('div.profile-link').click();
    cy.get('#deactivateButton').click();
    cy.get('#deactivateAccountButton').click();
  })
})

/**
describe('new post', () => {
  it('make new post', () => {
    cy.visit('http://localhost:3000');
    cy.get('#username').type('stacey');
    cy.get('#password').type("1");
    cy.get('#loginButton').click();
    cy.wait(1000);
    cy.get('#forMessages').should('be.visible');
    cy.get('div.group-info').click();
    cy.get('#postCaption').type('cypress test post!');
    cy.get('button.post-button').click();
    cy.wait(2000);
  })
  
}) */


