<?php

namespace App\Events;

use Symfony\Component\HttpFoundation\Cookie;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\HttpFoundation\JsonResponse;

class JwtSubscriber
{
    private $tokenLifetime;

    public function __construct(int $tokenLifetime)
    {
        $this->tokenLifetime = $tokenLifetime;
    }
    
    public function updateJwtData(JWTCreatedEvent $event)
    {
        $user = $event->getUser();
        $data = $event->getData();

        $data['firstName'] = $user->getFirstName();
        $data['lastName'] = $user->getLastName();

        $event->setData($data);
    }

    /**
     * Set the jwt in a httpOnly cookie, that is inacessible for javascript
     */
    public function setJwtInCookie(AuthenticationSuccessEvent $event)
    {
        $event->getResponse()->headers->setCookie(
            new Cookie(
                'JWT', // Cookie name, should be the same as in config/packages/lexik_jwt_authentication.yaml.
                $event->getData()['token'], // cookie value
                time() + $this->tokenLifetime, // expiration
                '/', // path
                null, // domain, null means that Symfony will generate it on its own.
                false, // secure
                true, // httpOnly
                false, // raw
                'lax' // same-site parameter, can be 'lax' or 'strict'.
            )
        );
    }
}