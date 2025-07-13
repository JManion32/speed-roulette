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

    it('test game setup', () => {
        cy.get('[data-cy="nickname-enter-form"]')
            .should('be.visible')
            .clear()
            .type('cypress');
        cy.get('[data-cy="play-button"]').click();
        cy.contains('cypress').should('be.visible');
        cy.get('[data-cy="balance-display"]').should('have.text', '$20.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$0.00');
        cy.get('[data-cy="timer-display"]').should('have.text', '60');
        cy.wait(2000); // make sure timer isn't moving
        cy.get('[data-cy="timer-display"]').should('have.text', '60');
        cy.get('[data-cy="spins-display"]').should('have.text', '10');
    });

    it('test game setup', () => {
        cy.get('[data-cy="nickname-enter-form"]')
            .should('be.visible')
            .clear()
            .type('cypress');
        cy.get('[data-cy="play-button"]').click();
        cy.contains('cypress').should('be.visible');
        cy.get('[data-cy="balance-display"]').should('have.text', '$20.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$0.00');
        cy.get('[data-cy="timer-display"]').should('have.text', '60');
        cy.wait(2000); // make sure timer isn't moving
        cy.get('[data-cy="timer-display"]').should('have.text', '60');
        cy.get('[data-cy="spins-display"]').should('have.text', '10');
    });

    it('test game setup', () => {
        cy.get('[data-cy="nickname-enter-form"]')
            .should('be.visible')
            .clear()
            .type('cypress');
        cy.get('[data-cy="play-button"]').click();
        cy.contains('cypress').should('be.visible');
        cy.get('[data-cy="balance-display"]').should('have.text', '$20.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$0.00');
        cy.get('[data-cy="timer-display"]').should('have.text', '60');
        cy.wait(2000); // make sure timer isn't moving
        cy.get('[data-cy="timer-display"]').should('have.text', '60');
        cy.get('[data-cy="spins-display"]').should('have.text', '10');
    });
});
