<?php

namespace App\Tests\Integration\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

/**
 * Integration test for SecurityController login endpoint
 * Tests JWT authentication flow
 */
class SecurityControllerTest extends WebTestCase {
    /**
     * Test successful login with valid credentials
     */
    public function testLoginSuccessWithValidCredentials(): void {
        $client = static::createClient();

        // Send POST request to /api/login
        $client->request(
            'POST',
            '/api/login',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'email' => 'admin@maintly.com',
                'password' => 'MaintlyAdmin!@#'
            ])
        );

        // Assert response status is 200 OK
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        // Assert response is JSON
        $this->assertResponseHeaderSame('content-type', 'application/json');

        // Get response data
        $responseData = json_decode($client->getResponse()->getContent(), true);

        // Assert JWT token exists in response
        $this->assertArrayHasKey('token', $responseData);
        $this->assertNotEmpty($responseData['token']);

        // Assert token has 3 parts (header.payload.signature)
        $tokenParts = explode('.', $responseData['token']);
        $this->assertCount(3, $tokenParts, 'JWT token should have 3 parts');
    }

    /**
     * Test login failure with invalid credentials
     */
    public function testLoginFailsWithInvalidCredentials(): void {
        $client = static::createClient();

        $client->request(
            'POST',
            '/api/login',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'email' => 'admin@maintly.com',
                'password' => 'WrongPassword123'
            ])
        );

        // Assert response status is 401 Unauthorized
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test login failure with missing email field
     */
    public function testLoginFailsWithMissingEmail(): void {
        $client = static::createClient();

        $client->request(
            'POST',
            '/api/login',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'password' => 'MaintlyAdmin!@#'
            ])
        );

        // Assert response status is 400 Bad Request or 401 Unauthorized
        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
    }

    /**
     * Test login failure with missing password field
     */
    public function testLoginFailsWithMissingPassword(): void {
        $client = static::createClient();

        $client->request(
            'POST',
            '/api/login',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'email' => 'admin@maintly.com'
            ])
        );

        // Assert response status is 400 Bad Request or 401 Unauthorized
        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
    }

    /**
     * Test login failure with non-existent user
     */
    public function testLoginFailsWithNonExistentUser(): void {
        $client = static::createClient();

        $client->request(
            'POST',
            '/api/login',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'email' => 'nonexistent@example.com',
                'password' => 'SomePassword123'
            ])
        );

        // Assert response status is 401 Unauthorized
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test that JWT token can be used to access protected endpoint
     */
    public function testAuthenticatedAccessWithJwtToken(): void {
        $client = static::createClient();

        // Step 1: Login to get JWT token
        $client->request(
            'POST',
            '/api/login',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'email' => 'admin@maintly.com',
                'password' => 'MaintlyAdmin!@#'
            ])
        );

        $loginResponse = json_decode($client->getResponse()->getContent(), true);
        $token = $loginResponse['token'];

        // Step 2: Use token to access protected /api/me endpoint
        $client->request(
            'GET',
            '/api/me',
            [],
            [],
            [
                'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
                'CONTENT_TYPE' => 'application/json'
            ]
        );

        // Assert access is granted
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        // Assert response contains user data
        $userData = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('data', $userData);
        $this->assertArrayHasKey('email', $userData['data']);
        $this->assertEquals('admin@maintly.com', $userData['data']['email']);
    }

    /**
     * Test that protected endpoint returns 403 without JWT token
     * Note: Symfony + Lexik JWT Bundle returns 403 Forbidden (not 401) for missing tokens
     * This is standard behavior - the firewall blocks access before authentication
     */
    public function testProtectedEndpointFailsWithoutToken(): void {
        $client = static::createClient();

        // Try to access /api/me without token
        $client->request('GET', '/api/me');

        // Assert response status is 403 Forbidden (standard Symfony/Lexik behavior)
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }
}
