// Tests everything outside of the game: modals, pages, dark-mode, etc.
describe('Navigation and Static UI', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.visit('/');
    });

    it('displays the game title', () => {
        cy.contains('Speed Roulette').should('be.visible');
    });

    it('displays feature suggestion', () => {
        cy.get('[data-cy="dark-mode-toggle"]').click();
        cy.wait(1000);
        cy.get('[data-cy="dark-mode-toggle"]').click();
        cy.wait(1000);
        cy.get('[data-cy="dark-mode-toggle"]').click();
        cy.wait(1000);
        cy.get('[data-cy="dark-mode-toggle"]').click();
        cy.wait(1000);
        cy.get('[data-cy="dark-mode-toggle"]').click();
    });

    it('toggle dark mode', () => {
        cy.contains('Have a feature suggestion?').should('be.visible');
    });

    it('loads leaderboard page', () => {
        cy.intercept('GET', '/api/leaderboard*', (req) => req.reply(200, [])).as('getLeaderboard');

        cy.get('[data-cy="open-leaderboard-page"]').click();
        cy.wait('@getLeaderboard');

        cy.contains('Leaderboard').should('be.visible');
        ['Today', 'This Week', 'This Month', 'All Time'].forEach((label) => cy.contains(label).should('be.visible'));

        cy.get('[data-cy="home-button"]').click();
        cy.contains('Speed Roulette').should('be.visible');
    });

    it('loads stats page', () => {
        cy.intercept('GET', '/api/stats*', (req) => req.reply(200, {})).as('getStats');

        cy.get('[data-cy="open-stats-page"]').click();
        cy.wait('@getStats');

        cy.contains('Site Statistics').should('be.visible');
        ['Today', 'This Week', 'This Month', 'All Time'].forEach((label) => cy.contains(label).should('be.visible'));

        cy.get('[data-cy="home-button"]').click();
        cy.contains('Speed Roulette').should('be.visible');
    });

    it('shows nickname profanity alert', () => {
        cy.get('[data-cy="nickname-enter-form"]').clear().type('grass');
        cy.get('[data-cy="play-button"]').click();
        cy.contains('Please choose a clean nickname!').should('be.visible');
    });
});
