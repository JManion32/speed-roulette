// Tests everything outside of the game (About Modal, Privacy Modal, Homepage, Leaderboards, Stats)

describe('Navigation and Static UI', () => {
    beforeEach(() => cy.visit('/'));

    it('displays the game title', () => {
      cy.contains('Speed Roulette').should('be.visible');
    });

    it('displays feature suggestion', () => {
      cy.contains('Have a feature suggestion?').should('be.visible');
    });

    it('dark mode toggle is working', () => {
        cy.get('[data-cy="main-app-div"]').should('have.css', 'background-color', 'oklch(0.21 0.034 264.665)'); // bg-gray-900
        cy.get('[data-cy="dark-mode-toggle"]').click();
        cy.get('[data-cy="main-app-div"]').should('have.css', 'background-color', 'rgb(233, 238, 243)');
        cy.get('[data-cy="dark-mode-toggle"]').click();
    });

    it('test about modal', () => {
        cy.get('[data-cy="open-about-modal"]').click();
        cy.contains('About').should('be.visible');
        cy.contains('Rules').click();
        cy.contains('Standard Roulette Rules').should('be.visible');
        cy.contains('Contact').click();
        cy.contains('Inquiries').should('be.visible');
        cy.get('[data-cy="close-about-modal"]').click();
    });

    it('test leaderboard page', () => {
        cy.intercept('GET', '/api/leaderboard*').as('getLeaderboard');
        cy.get('[data-cy="open-leaderboard-page"]').click();
        cy.wait('@getLeaderboard')
          .its('response.statusCode')
          .should('eq', 200);
        cy.contains('Leaderboard').should('be.visible');
        cy.contains('Today').should('be.visible');
        cy.contains('This Week').should('be.visible');
        cy.contains('This Month').should('be.visible');
        cy.contains('All Time').should('be.visible');
        cy.get('[data-cy="home-button"]').click();
        cy.contains('Speed Roulette').should('be.visible');
    });

    it('test stats page', () => {
        cy.intercept('GET', '/api/stats*').as('getStats');
        cy.get('[data-cy="open-stats-page"]').click();
        cy.wait('@getStats')
          .its('response.statusCode')
          .should('eq', 200);
        cy.contains('Site Statistics').should('be.visible');
        cy.contains('Today').should('be.visible');
        cy.contains('This Week').should('be.visible');
        cy.contains('This Month').should('be.visible');
        cy.contains('All Time').should('be.visible');
        cy.get('[data-cy="home-button"]').click();
        cy.contains('Speed Roulette').should('be.visible');
    });

    it('show nickname alert', () => {
      cy.get('[data-cy="nickname-enter-form"]')
        .should('be.visible')
        .clear()
        .type('grass'); // user can't hide bad words
      cy.get('[data-cy="play-button"]').click();
      cy.contains('Please choose a clean nickname!').should('be.visible');
    });
});
