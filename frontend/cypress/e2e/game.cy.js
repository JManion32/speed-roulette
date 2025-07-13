// Tests everything within the game (bet placements, action buttons, display, Result Modal)

describe('Game', () => {
    beforeEach(() => cy.visit('/'));

    it('registers on Play and logs out on Home', () => {
    cy.intercept('POST', '/api/register').as('register');
    cy.get('[data-cy="nickname-enter-form"]')
        .should('be.visible')
        .clear()
        .type('cypress');

    cy.get('[data-cy="play-button"]').click();
    cy.wait('@register')
        .its('response.statusCode')
        .should('be.oneOf', [200, 201]);

    cy.window().its('localStorage.nickname').should('exist');
    cy.contains('cypress').should('be.visible');
    cy.contains('Balance:').should('be.visible');
    cy.window().its('localStorage.token').should('exist');

    cy.intercept('DELETE', '/api/logout').as('logout');
    cy.get('[data-cy="home-button"]').click();
    cy.wait('@logout');

    cy.contains('Speed Roulette').should('be.visible');
    cy.window().its('localStorage.nickname').should('be.undefined');
    cy.window().its('localStorage.token').should('be.undefined');
    });
});
