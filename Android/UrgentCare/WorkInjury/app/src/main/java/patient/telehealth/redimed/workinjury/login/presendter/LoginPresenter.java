package patient.telehealth.redimed.workinjury.login.presendter;

import android.app.Activity;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.home.HomeFragment;
import patient.telehealth.redimed.workinjury.login.view.ILoginView;
import patient.telehealth.redimed.workinjury.model.RolesModel;
import patient.telehealth.redimed.workinjury.model.UserModel;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.utils.Key;
import patient.telehealth.redimed.workinjury.utils.Key.Login;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by MeditekMini on 5/19/16.
 */
public class LoginPresenter implements ILoginPresenter {

    private String TAG = Key.Login.TAG;
    private Gson gson;
    private AppCompatActivity activity;
    private ILoginView iLoginView;
    private MyApplication application;
    private String deviceToken;

    public LoginPresenter(ILoginView iLoginView, Activity activity) {
        this.activity = (AppCompatActivity) activity;
        this.iLoginView = iLoginView;

        gson = new Gson();
        application = MyApplication.getInstance();
        deviceToken = String.valueOf(application.getDataSharedPreferences(Key.deviceToken, Key.defalt));
    }

    @Override
    public void CheckActivation(String phone) {
        JsonObject objData = new JsonObject();
        objData.addProperty(Key.Login.data, application.parseToJson(new String[]{Key.Login.phone, phone}));
        RESTClient.getTelehealthApi().checkActivation(objData, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                application.setDataSharedPreferences(Key.useruid,jsonObject.get(Key.Login.UserUID).getAsString());
                iLoginView.ResponseSuccess();
            }

            @Override
            public void failure(RetrofitError error) {
                application.FunctionError(error.getLocalizedMessage());
            }
        });
    }

    @Override
    public void Login(String verityCode) {
        String UserUID = (String) application.getDataSharedPreferences(Key.useruid, Key.defalt);
        String[] data = {Key.Login.UserUID, UserUID, Key.Login.PinNumber, verityCode, Key.Login.UserName, Key.Login.DefaultUserName, Key.Login.Password, Key.Login.DefaultPassword};

        RESTClient.getAuthApi().login(application.createJson(data), new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String token = jsonObject.get(Key.Login.token).getAsString();
                String refreshCode = jsonObject.get(Key.Login.refreshCode).getAsString();
                UserModel userModel = gson.fromJson(jsonObject.get(Key.Login.user).getAsJsonObject(), UserModel.class);
                String useruid = userModel.getUID();
                String username = userModel.getUserName();

                for (RolesModel rolesModel : userModel.getRoles()) {
                    if (rolesModel.getRoleCode().equals(Key.typeNameCompany)){
                        application.setDataSharedPreferences(Key.isTypeCompany, true);
                    }
                }

                application.setDataSharedPreferences(Key.token, token);
                application.setDataSharedPreferences(Key.refreshCode, refreshCode);
                application.setDataSharedPreferences(Key.useruid, useruid);
                application.setDataSharedPreferences(Key.username, username);
                application.setDataSharedPreferences(Key.isAuthenticated, true);

                GetTelehealthUser(useruid);
            }

            @Override
            public void failure(RetrofitError error) {
                application.FunctionError(error.getLocalizedMessage());
            }
        });
    }

    @Override
    public void GetTelehealthUser(String uid) {
        String[] data = {Key.Login.uid, uid, Key.token, deviceToken};
        RESTClient.getTelehealthApi().getTelehealthUser(application.createJson(data), new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String TeleUid = jsonObject.get(Login.data).getAsJsonObject().get(Login.telehealthUser).getAsJsonObject().get(Login.UID).getAsString();
                String DeviceID = jsonObject.get(Login.data).getAsJsonObject().get(Login.telehealthDevice).getAsJsonObject().get(Login.deviceID).getAsString();
                String PatientUid = jsonObject.get(Login.data).getAsJsonObject().get(Login.patientInfo).getAsJsonObject().get(Login.UID).getAsString();
                Log.d(TAG, DeviceID);
                application.setDataSharedPreferences(Key.teleUid, TeleUid);
                application.setDataSharedPreferences(Key.patientUid, PatientUid);
                application.setDataSharedPreferences(Key.deviceID, DeviceID);
                application.setDataSharedPreferences(Key.deviceToken, deviceToken);

                //change page home
                application.replaceFragment(new HomeFragment(),Key.fmHome,null);
            }

            @Override
            public void failure(RetrofitError error) {
                application.FunctionError(error.getLocalizedMessage());
            }
        });
    }

    @Override
    public void ForgetPin(String phone) {
        String[] data = {Key.Login.phone, phone, Key.token, deviceToken};

        RESTClient.getTelehealthApi().forgetPin(application.createJson(data), new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                Log.d(TAG, String.valueOf(jsonObject));
            }

            @Override
            public void failure(RetrofitError error) {
                application.FunctionError(error.getLocalizedMessage());
            }
        });
    }

    @Override
    public void LoginAccount(String user, String pass) {

        String[] data = {Key.Login.UserName, user, Key.Login.Password, pass};

        RESTClient.getAuthApi().login(application.createJson(data), new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String token = jsonObject.get(Key.Login.token).getAsString();
                String refreshCode = jsonObject.get(Key.Login.refreshCode).getAsString();
                UserModel userModel = gson.fromJson(jsonObject.get(Key.Login.user).getAsJsonObject(), UserModel.class);
                String useruid = userModel.getUID();
                String username = userModel.getUserName();

                for (RolesModel rolesModel : userModel.getRoles()) {
                    if (rolesModel.getRoleCode().equals(Key.typeNameCompany)){
                        application.setDataSharedPreferences(Key.isTypeCompany, true);
                    }
                }

                application.setDataSharedPreferences(Key.token, token);
                application.setDataSharedPreferences(Key.refreshCode, refreshCode);
                application.setDataSharedPreferences(Key.useruid, useruid);
                application.setDataSharedPreferences(Key.username, username);
                application.setDataSharedPreferences(Key.isAuthenticated, true);

                GetTelehealthUser(useruid);
            }

            @Override
            public void failure(RetrofitError error) {

            }
        });
    }

    //Validated phone number match 10-15 digit numbers
    @Override
    public void validatedPhone(String phoneNumber) {
        String result;
        String code = activity.getResources().getString(R.string.phone_code);
        if (phoneNumber.length() == 0) {
            result = "wrong";
        } else {
            String expression = "^(/+61|0061|0)?4[0-9]{8}$";
            Pattern pattern = Pattern.compile(expression, Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(phoneNumber);
            if (matcher.matches()) {
                String mobile = null;
                String subStringMobile = phoneNumber.substring(0, 4);
                if (subStringMobile.equalsIgnoreCase("0061")) {
                    mobile = code + phoneNumber.substring(4, phoneNumber.length());
                } else {
                    char subPhone = phoneNumber.charAt(0);
                    switch (subPhone) {
                        case '0':
                            mobile = code + phoneNumber.substring(1);
                            break;
                        case '4':
                            mobile = code + phoneNumber;
                            break;
                        case '+':
                            mobile = code + phoneNumber;
                            break;
                    }
                }
                result = mobile;
            } else {
                result = "wrong";
            }
        }
        iLoginView.onValidated(result);
    }
}
