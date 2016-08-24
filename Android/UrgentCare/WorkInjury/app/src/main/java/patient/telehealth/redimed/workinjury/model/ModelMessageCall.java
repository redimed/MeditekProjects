package patient.telehealth.redimed.workinjury.model;

/**
 * Created by macos on 8/19/16.
 */
public class ModelMessageCall {

    private String message;
    private String apiKey;
    private String sessionId;
    private String token;
    private String teleCallUID;
    private String callName;
    private String callerName;
    private String callerTeleUID;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTeleCallUID() {
        return teleCallUID;
    }

    public void setTeleCallUID(String teleCallUID) {
        this.teleCallUID = teleCallUID;
    }

    public String getCallName() {
        return callName;
    }

    public void setCallName(String callName) {
        this.callName = callName;
    }

    public String getCallerName() {
        return callerName;
    }

    public void setCallerName(String callerName) {
        this.callerName = callerName;
    }

    public String getCallerTeleUID() {
        return callerTeleUID;
    }

    public void setCallerTeleUID(String callerTeleUID) {
        this.callerTeleUID = callerTeleUID;
    }
}
