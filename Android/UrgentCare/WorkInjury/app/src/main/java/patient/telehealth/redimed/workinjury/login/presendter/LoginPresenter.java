package patient.telehealth.redimed.workinjury.login.presendter;

import android.app.Activity;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.home.HomeFragment;
import patient.telehealth.redimed.workinjury.login.view.ILoginView;
import patient.telehealth.redimed.workinjury.models.RolesModel;
import patient.telehealth.redimed.workinjury.models.UserModel;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.utils.Key;
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
    private String token;

    public LoginPresenter(ILoginView iLoginView, Activity activity) {
        this.activity = (AppCompatActivity) activity;
        this.iLoginView = iLoginView;

        gson = new Gson();
        application = MyApplication.getInstance();
        token = (String) application.getDataSharedPreferences(Key.deviceToken, Key.defalt);
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
                iLoginView.ResponseError();
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

                application.replaceFragment(activity, new HomeFragment(),Key.fmHome,null);
            }

            @Override
            public void failure(RetrofitError error) {

            }
        });
    }

    @Override
    public void GetTelehealthUser(String uid) {
        String[] data = {Key.Login.uid, uid, Key.token, token};
        RESTClient.getTelehealthApi().getTelehealthUser(application.createJson(data), new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String TeleUid = jsonObject.get(Key.Login.data).getAsJsonObject().get(Key.Login.telehealthUser).getAsJsonObject().get(Key.Login.UID).getAsString();
                application.setDataSharedPreferences(Key.teleUid, TeleUid);
            }

            @Override
            public void failure(RetrofitError error) {

            }
        });
    }

    @Override
    public void ForgetPin(String phone) {
        String[] data = {Key.Login.phone, phone, Key.token, token};

        RESTClient.getTelehealthApi().forgetPin(application.createJson(data), new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                Log.d(TAG, String.valueOf(jsonObject));
            }

            @Override
            public void failure(RetrofitError error) {
            }
        });
    }
}
