// Tests everything inside the game: registration, logout, basic UI state
describe('Game', () => {
    /**
     * - Stub every network call **before** we visit the page so the app
     *   never hits the real backend in CI.  In local dev the stub is still
     *   fine because the UI logic only needs the status + body.
     */
    beforeEach(() => {
        cy.intercept('POST', '/api/register', {
            statusCode: 201,
            body: { nickname: 'cypress', token: 'fake-jwt' }
        }).as('register');

        cy.intercept('DELETE', '/api/logout', { statusCode: 204 }).as('logout');

        cy.visit('/');
    });

    it('registers on Play and logs out on Home', () => {
        cy.get('[data-cy="nickname-enter-form"]')
            .clear()
            .type('cypress');

        cy.get('[data-cy="play-button"]').click();
        cy.wait('@register')
            .its('response.statusCode')
            .should('be.oneOf', [200, 201]);

        cy.window().its('localStorage.nickname').should('eq', 'cypress');
        cy.contains('cypress').should('be.visible');
        cy.contains('Balance:').should('be.visible');
        cy.window().its('localStorage.token').should('exist');

        cy.get('[data-cy="home-button"]').click();
        cy.wait('@logout');

        cy.contains('Speed Roulette').should('be.visible');
        cy.window().its('localStorage.nickname').should('be.undefined');
        cy.window().its('localStorage.token').should('be.undefined');
    });

    it('shows correct initial game state', () => {
        cy.get('[data-cy="nickname-enter-form"]')
            .clear()
            .type('cypress');
        cy.get('[data-cy="play-button"]').click();

        cy.contains('cypress').should('be.visible');
        cy.get('[data-cy="balance-display"]').should('have.text', '$20.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$0.00');
        cy.get('[data-cy="timer-display"]').should('have.text', '60');
        cy.wait(2000); // timer should not tick until first spin
        cy.get('[data-cy="timer-display"]').should('have.text', '60');
        cy.get('[data-cy="spins-display"]').should('have.text', '10');
    });
});
