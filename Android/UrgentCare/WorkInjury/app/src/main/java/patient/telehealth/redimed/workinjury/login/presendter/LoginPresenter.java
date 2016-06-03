package patient.telehealth.redimed.workinjury.login.presendter;

import android.support.v4.app.FragmentActivity;
import android.util.Log;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.home.HomeFragment;
import patient.telehealth.redimed.workinjury.login.view.ILoginView;
import patient.telehealth.redimed.workinjury.model.RolesModel;
import patient.telehealth.redimed.workinjury.model.UserModel;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by MeditekMini on 5/19/16.
 */
public class LoginPresenter implements ILoginPresenter {

    private Gson gson;
    private FragmentActivity fragmentActivity;
    private ILoginView iLoginView;

    public LoginPresenter(ILoginView iLoginView, FragmentActivity fragmentActivity) {
        this.fragmentActivity = fragmentActivity;
        this.iLoginView = iLoginView;

        gson = new Gson();
    }

    @Override
    public void CheckActivation(String phone) {
        JsonObject objData = new JsonObject();
        objData.addProperty("data", MyApplication.getInstance().parseToJson(new String[]{"phone", phone}));
        RESTClient.getTelehealthApi().checkActivation(objData, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                MyApplication.getInstance().setDataSharedPreferences("useruid",jsonObject.get("UserUID").getAsString());
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
        String UserUID = (String) MyApplication.getInstance().getDataSharedPreferences("useruid","");

        RESTClient.getAuthApi().login(MyApplication.getInstance().createJson(new String[]{"UserUID", UserUID, "PinNumber", verityCode, "UserName", "1", "Password", "1"}), new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String token = jsonObject.get("token").getAsString();
                String refreshCode = jsonObject.get("refreshCode").getAsString();
                UserModel userModel = gson.fromJson(jsonObject.get("user").getAsJsonObject(), UserModel.class);
                String useruid = (jsonObject.get("user").getAsJsonObject()).get("UID").getAsString();
                String username = (jsonObject.get("user").getAsJsonObject()).get("UserName").getAsString();

                for (RolesModel rolesModel : userModel.getRoles()) {
                    if (rolesModel.getRoleCode().equals("ORGANIZATION")){
                        MyApplication.getInstance().setDataSharedPreferences("isTypeCompany", true);
                    }
                }

                MyApplication.getInstance().setDataSharedPreferences("token", token);
                MyApplication.getInstance().setDataSharedPreferences("refreshCode", refreshCode);
                MyApplication.getInstance().setDataSharedPreferences("useruid", useruid);
                MyApplication.getInstance().setDataSharedPreferences("username", username);
                MyApplication.getInstance().setDataSharedPreferences("isAuthenticated", true);

                GetTelehealthUser(useruid);

                MyApplication.getInstance().replaceFragment( fragmentActivity, new HomeFragment());
            }

            @Override
            public void failure(RetrofitError error) {

            }
        });
    }

    @Override
    public void GetTelehealthUser(String uid) {
        String token = (String) MyApplication.getInstance().getDataSharedPreferences("deviceToken", "");

        RESTClient.getTelehealthApi().getTelehealthUser(MyApplication.getInstance().createJson(new String[]{"uid", uid, "token", token}), new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                Log.d("GetTelehealthUser", String.valueOf(jsonObject));
            }

            @Override
            public void failure(RetrofitError error) {

            }
        });
    }

    @Override
    public void ForgetPin(String phone) {
        String token = (String) MyApplication.getInstance().getDataSharedPreferences("deviceToken", "");

        RESTClient.getTelehealthApi().forgetPin(MyApplication.getInstance().createJson(new String[]{"phone", phone, "token", token}), new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                Log.d("GetTelehealthUser", String.valueOf(jsonObject));
            }

            @Override
            public void failure(RetrofitError error) {
            }
        });
    }
}
