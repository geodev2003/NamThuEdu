<?php

namespace App\Core;

class Router
{
    private array $routes = [];

    /* =====================
     * Đăng ký route
     * ===================== */

    public function get(string $uri, string $action): void
    {
        $this->addRoute('GET', $uri, $action);
    }

    public function post(string $uri, string $action): void
    {
        $this->addRoute('POST', $uri, $action);
    }

    public function put(string $uri, string $action): void
    {
        $this->addRoute('PUT', $uri, $action);
    }

    public function delete(string $uri, string $action): void
    {
        $this->addRoute('DELETE', $uri, $action);
    }

    private function addRoute(string $method, string $uri, string $action): void
    {
        $this->routes[$method][] = [
            'uri'    => trim($uri, '/'),
            'action' => $action
        ];
    }

    /* =====================
     * Chạy router
     * ===================== */

    public function run(): void
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $requestUri = trim($requestUri, '/');

        if (!isset($this->routes[$method])) {
            $this->notFound();
            return;
        }

        foreach ($this->routes[$method] as $route) {
            $pattern = preg_replace('#\{[^/]+\}#', '([^/]+)', $route['uri']);
            $pattern = "#^{$pattern}$#";

            if (preg_match($pattern, $requestUri, $matches)) {
                array_shift($matches); // bỏ full match
                $this->dispatch($route['action'], $matches);
                return; // ✅ chỉ return; không trả giá trị
            }
        }

        $this->notFound();
    }

    /* =====================
     * Gọi Controller
     * ===================== */

    private function dispatch(string $action, array $params = []): void
    {
        if (!str_contains($action, '@')) {
            throw new \Exception('Invalid route action');
        }

        [$controllerName, $method] = explode('@', $action);

        $controllerClass = "App\\Controllers\\{$controllerName}";

        if (!class_exists($controllerClass)) {
            throw new \Exception("Controller {$controllerClass} not found");
        }

        $controller = new $controllerClass();

        if (!method_exists($controller, $method)) {
            throw new \Exception("Method {$method} not found in {$controllerClass}");
        }

        call_user_func_array([$controller, $method], $params);
    }

    /* =====================
     * 404 JSON
     * ===================== */

    private function notFound(): void
    {
        http_response_code(404);
        echo json_encode([
            'status'  => 'error',
            'message' => 'API not found'
        ]);
    }
}
