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

        cy.intercept('POST', '/api/round', (req) => {
            expect(req.body).to.have.property('bets');
            expect(Array.isArray(req.body.bets)).to.be.true;
            expect(req.body.bets.length).to.be.greaterThan(0);
            expect(req.body.bets[0]).to.have.all.keys('gridIndex', 'gridId', 'chipValue', 'chipColor');

            req.reply({
                statusCode: 200,
                body: {
                    number: 7,
                    payout: 10
                }
            });
        }).as('round');

        cy.intercept('POST', '/api/game', (req) => {
            expect(req.body).to.have.all.keys('final_balance', 'nickname', 'rem_spins', 'rem_time');

            req.reply({
                statusCode: 200,
                body: {
                    status: 'success',
                    rank: 1
                }
            });
        }).as('round');

        cy.viewport(1920, 1080);
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

    it('simulate full game', () => {
        cy.get('[data-cy="nickname-enter-form"]')
            .clear()
            .type('cypress');
        cy.get('[data-cy="play-button"]').click();
        cy.get('[data-cy="chip-5"]').click();
        cy.get('[data-cy="outer-2"]').click();
        cy.get('[data-cy="submit-button"]').click();
        cy.wait(5000);
        cy.get('[data-cy="balance-display"]').should('have.text', '$25.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$0.00');
        cy.get('[data-cy="spins-display"]').should('have.text', '9');
        cy.wait(60000);
        cy.contains('ROUND FINISHED!').should('be.visible');
        cy.get('[data-cy="result-balance"]').should('have.text', '$25.00');
        cy.get('[data-cy="result-time"]').should('have.text', '0s');
        cy.get('[data-cy="result-spins"]').should('have.text', '9');
        cy.get('[data-cy="user-rank"]').should('have.text', '#1');
        cy.get('[data-cy="result-play-again"]').click();
        cy.contains('cypress').should('be.visible');
        cy.get('[data-cy="home-button"]').click();
    });

    it('shows correct initial game state', () => {
        cy.get('[data-cy="nickname-enter-form"]')
            .clear()
            .type('cypress');
        cy.get('[data-cy="play-button"]').click();

        cy.contains('cypress').should('be.visible');
        cy.get('[data-cy="balance-display"]').should('have.text', '$20.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$0.00');
        cy.get('[data-cy="timer-display"]').should('have.text', '60s');
        cy.wait(2000); // timer should not tick until first spin
        cy.get('[data-cy="timer-display"]').should('have.text', '60s');
        cy.get('[data-cy="spins-display"]').should('have.text', '10');
        cy.get('[data-cy="chip-0.5"]').click();
        cy.get('[data-cy="chip-1"]').click();
        cy.get('[data-cy="chip-2"]').click();
        cy.get('[data-cy="chip-5"]').click();
        cy.get('[data-cy="chip-10"]').click();
        cy.get('[data-cy="chip-20"]').click();
    });

    it('outer bet placements + dynamic balance & bet amount + clear & undo', () => {
        cy.get('[data-cy="nickname-enter-form"]')
            .clear()
            .type('cypress');
        cy.get('[data-cy="play-button"]').click();
        cy.get('[data-cy="chip-0.5"]').click();
        cy.get('[data-cy="balance-display"]').should('have.text', '$20.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$0.00');
        cy.get('[data-cy="outer-0"]').click();
        cy.get('[data-cy="balance-display"]').should('have.text', '$19.50');
        cy.get('[data-cy="bet-display"]').should('have.text', '$0.50');
        cy.get('[data-cy="outer-1"]').click();
        cy.get('[data-cy="balance-display"]').should('have.text', '$19.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$1.00');
        cy.get('[data-cy="outer-2"]').click();
        cy.get('[data-cy="balance-display"]').should('have.text', '$18.50');
        cy.get('[data-cy="bet-display"]').should('have.text', '$1.50');
        cy.get('[data-cy="outer-3"]').click();
        cy.get('[data-cy="balance-display"]').should('have.text', '$18.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$2.00');
        cy.get('[data-cy="outer-4"]').click();
        cy.get('[data-cy="balance-display"]').should('have.text', '$17.50');
        cy.get('[data-cy="bet-display"]').should('have.text', '$2.50');
        cy.get('[data-cy="outer-5"]').click();
        cy.get('[data-cy="balance-display"]').should('have.text', '$17.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$3.00');

        cy.get('[data-cy="clear-button"]').click();
        cy.get('[data-cy="balance-display"]').should('have.text', '$20.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$0.00');

        cy.get('[data-cy="chip-1"]').click();
        cy.get('[data-cy="dozen-0"]').click();
        cy.get('[data-cy="balance-display"]').should('have.text', '$19.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$1.00');
        cy.get('[data-cy="dozen-1"]').click();
        cy.get('[data-cy="balance-display"]').should('have.text', '$18.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$2.00');
        cy.get('[data-cy="dozen-2"]').click();
        cy.get('[data-cy="balance-display"]').should('have.text', '$17.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$3.00');

        cy.get('[data-cy="clear-button"]').click();
        cy.get('[data-cy="balance-display"]').should('have.text', '$20.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$0.00');

        cy.get('[data-cy="chip-2"]').click();
        cy.get('[data-cy="row-0"]').click();
        cy.get('[data-cy="balance-display"]').should('have.text', '$18.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$2.00');
        cy.get('[data-cy="row-1"]').click();
        cy.get('[data-cy="balance-display"]').should('have.text', '$16.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$4.00');
        cy.get('[data-cy="row-2"]').click();
        cy.get('[data-cy="balance-display"]').should('have.text', '$14.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$6.00');

        cy.get('[data-cy="clear-button"]').click();
        cy.get('[data-cy="balance-display"]').should('have.text', '$20.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$0.00');

        cy.get('[data-cy="chip-5"]').click();
        cy.get('[data-cy="zero-0"]').click();
        cy.get('[data-cy="balance-display"]').should('have.text', '$15.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$5.00');
        cy.get('[data-cy="zero-1"]').click();
        cy.get('[data-cy="balance-display"]').should('have.text', '$10.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$10.00');
        cy.get('[data-cy="zero-2"]').click();
        cy.get('[data-cy="balance-display"]').should('have.text', '$5.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$15.00');
        cy.get('[data-cy="clear-button"]').click();
        cy.get('[data-cy="balance-display"]').should('have.text', '$20.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$0.00');

        cy.get('[data-cy="chip-1"]').click();
        for (let i = 0; i <= 7; i++) {
            cy.get(`[data-cy="zero-split-${i}"]`).click();
        }
        cy.get('[data-cy="balance-display"]').should('have.text', '$12.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$8.00');
        for (let i = 0; i <= 7; i++) {
            cy.get('[data-cy="undo-button"]').click();
        }
        cy.get('[data-cy="balance-display"]').should('have.text', '$20.00');
        cy.get('[data-cy="bet-display"]').should('have.text', '$0.00');
    });

    // ensure all inner cells on the roulette board are interactive
    it('all inner bet placements', () => {
        cy.get('[data-cy="nickname-enter-form"]')
            .clear()
            .type('cypress');
        cy.get('[data-cy="play-button"]').click();
        cy.get('[data-cy="chip-0.5"]').click();
        for (let i = 0; i <= 137; i++) {
            cy.get(`[data-cy="inner-${i}"]`).click();
            if ((i + 1) % 39 === 0) {
                cy.get('[data-cy="clear-button"]').click();
            }
        }
    });
});
