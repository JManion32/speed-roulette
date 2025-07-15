// Tests everything outside of the game: modals, pages, dark-mode, etc.
describe('Navigation and Static UI', () => {
    beforeEach(() => cy.visit('/'));

    it('displays the game title', () => {
        cy.contains('Speed Roulette').should('be.visible');
    });

    it('displays feature suggestion', () => {
        cy.contains('Have a feature suggestion?').should('be.visible');
    });

    it('opens About modal and navigates tabs', () => {
        cy.get('[data-cy="open-about-modal"]').click();
        cy.contains('About').should('be.visible');

        cy.contains('Rules').click();
        cy.contains('Standard Roulette Rules').should('be.visible');

        cy.contains('Contact').click();
        cy.contains('Inquiries').should('be.visible');

        cy.get('[data-cy="close-about-modal"]').click();
    });

    it('loads leaderboard page', () => {
        cy.intercept('GET', '/api/leaderboard*', (req) => req.reply(200, [])).as('getLeaderboard');

        cy.get('[data-cy="open-leaderboard-page"]').click();
        cy.wait('@getLeaderboard');

        cy.contains('Leaderboard').should('be.visible');
        ['Today', 'This Week', 'This Month', 'All Time'].forEach((label) =>
            cy.contains(label).should('be.visible')
        );

        cy.get('[data-cy="home-button"]').click();
        cy.contains('Speed Roulette').should('be.visible');
    });

    it('loads stats page', () => {
        cy.intercept('GET', '/api/stats*', (req) => req.reply(200, {})).as('getStats');

        cy.get('[data-cy="open-stats-page"]').click();
        cy.wait('@getStats');

        cy.contains('Site Statistics').should('be.visible');
        ['Today', 'This Week', 'This Month', 'All Time'].forEach((label) =>
            cy.contains(label).should('be.visible')
        );

        cy.get('[data-cy="home-button"]').click();
        cy.contains('Speed Roulette').should('be.visible');
    });

    it('shows nickname profanity alert', () => {
        cy.get('[data-cy="nickname-enter-form"]')
            .clear()
            .type('grass');
        cy.get('[data-cy="play-button"]').click();
        cy.contains('Please choose a clean nickname!').should('be.visible');
    });
});
