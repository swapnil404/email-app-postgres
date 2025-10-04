# API Test Files

This directory contains JSON test files for all the APIs in the email application.

## Test Files Structure

- `auth/` - Authentication related tests
  - `register.json` - User registration tests
  - `login.json` - User login tests
- `emails/` - Email related tests
  - `send.json` - Email sending tests
  - `inbox_received.json` - Received emails tests
  - `inbox_sent.json` - Sent emails tests
- `user/` - User profile tests
  - `me.json` - User profile endpoint tests
- `error_cases/` - Error scenario tests
  - `validation_errors.json` - Input validation error tests
  - `auth_errors.json` - Authentication error tests

## Usage

These JSON files can be used with tools like:

- Postman (import collections)
- REST Client extensions
- curl commands
- Automated testing frameworks

Each test file includes multiple scenarios covering:

- Valid requests
- Invalid inputs
- Edge cases
- Error conditions

