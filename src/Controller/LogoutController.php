<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class LogoutController extends AbstractController
{
    /**
     * @Route("/api/user/logout", name="logout", methods={"POST"})
     */
    public function logout(Request $request) : Response
    {
        if ($request->cookies->get('JWT'))
        {   
            $response = new Response();
            $response->headers->clearCookie('JWT', '/', null);
            return $response;
        }
    }
}