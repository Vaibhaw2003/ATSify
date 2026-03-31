package com.atsify.dto;

/**
 * Response DTO for authentication (login/register).
 */
public class AuthResponse {
    private String token;
    private String userId;
    private String name;
    private String email;
    private String message;

    public AuthResponse() {}

    public AuthResponse(String token, String userId, String name, String email, String message) {
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.message = message;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
