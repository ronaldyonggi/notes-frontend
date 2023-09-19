describe('Note app', function() {
  beforeEach(function() {
    // Reset notes and users every time the test suite starts
    cy.request('POST', 'http://localhost:3001/api/testing/reset')

    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }

    // Create the user 'mluukkai' every time the test suite starts
    cy.request('POST', 'http://localhost:3001/api/users', user)

    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function() {
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2022')
  })

  it('login form can be opened', function() {
    cy.contains('log in').click()
  })

  it('user can login', function() {
    cy.contains('log in').click()
    // cy.get('input:first').type('mluukkai')
    // cy.get('input:last').type('salainen')
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('salainen')
    cy.get('#login-button').click()

    cy.contains('Matti Luukkainen logged in')

  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('log in').click()
      cy.get('input:first').type('mluukkai')
      cy.get('input:last').type('salainen')
      cy.get('#login-button').click()
    })

    it('a new note can be created', function() {
      cy.contains('new note').click()
      cy.get('input').type('a note created by cypress')
      cy.contains('save').click()
      cy.contains('a note created by cypress')
    })

    describe('and a note exists', function () {
      beforeEach(function () {
        cy.contains('new note').click()
        cy.get('input').type('another note cypress')
        cy.contains('save').click()
      })

      it('it can be made not important', function () {
        cy.contains('another note cypress')
          .contains('make not important')
          .click()

        cy.contains('another note cypress')
          .contains('make important')
      })
    })

  })

  it.only('login fails with wrong password', function() {
    cy.contains('log in').click()
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    // cy.contains('Wrong credentials')
    // cy.get('.error').contains('Wrong credentials')
    // cy.get('.error').should('contain', 'Wrong credentials')
    // cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    // cy.get('.error').should('have.css', 'border-style', 'solid')

    cy.get('.error')
      .should('contain', 'Wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    // cy.get('html')
    //   .should('not.contain', 'Matti Luukkainen logged in')
    cy.contains('Matti Luukkainen logged in')
      .should('not.exist')
  })
})
