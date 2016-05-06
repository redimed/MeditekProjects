package patient.telehealth.redimed.workinjury;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.ViewFlipper;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.model.RolesModel;
import patient.telehealth.redimed.workinjury.model.UserModel;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class LoginActivity extends AppCompatActivity implements View.OnClickListener {

    @Bind(R.id.btnBack) Button btnBack;
    @Bind(R.id.logo) ImageView mLogo;

    //=======Layout 1=========
    @Bind(R.id.btnCheckActivation) Button btnCheckActivation;
    @Bind(R.id.lblPhoneCode) TextView lblPhoneCode;
    @Bind(R.id.txtPhone) EditText txtPhone;

    //======Layout 2==========
    @Bind(R.id.btnSubmitPinNumber) Button btnSubmitPinNumber;
    @Bind(R.id.btnForgetPin) Button btnForgetPin;
    @Bind(R.id.txtVerifyCode) EditText txtVerifyCode;

    @Bind(R.id.layoutContainer) ViewFlipper layoutContainer;
    @Bind(R.id.layoutRegisterFone) LinearLayout layoutRegisterFone;

    private String UserUID;
    private Gson gson;
    private SharedPreferences workInjury;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        ButterKnife.bind(this);
        gson = new Gson();
        workInjury = getSharedPreferences("WorkInjury", MODE_PRIVATE);
        layoutContainer.setAnimateFirstView(true);
        layoutContainer.setAlpha(0.0f);
        layoutContainer.setDisplayedChild(layoutContainer.indexOfChild(layoutRegisterFone));

        //init function
        animationLogo();
        animationContainer();

        //set listener
        btnSubmitPinNumber.setOnClickListener(this);
        btnCheckActivation.setOnClickListener(this);
        btnBack.setOnClickListener(this);
        btnForgetPin.setOnClickListener(this);
    }

    public void animationLogo() {
        Animation anim = AnimationUtils.loadAnimation(this, R.anim.translate_center_to_top);
        mLogo.startAnimation(anim);
    }

    public void animationContainer() {
        layoutContainer.animate().setStartDelay(1700).setDuration(500).alpha(1.0f);
    }

    public void switchView(int inAnimation, int outAnimation, View v) {
        layoutContainer.setInAnimation(this, inAnimation);
        layoutContainer.setOutAnimation(this, outAnimation);
        if (layoutContainer.indexOfChild(v) == 0)
            layoutContainer.showNext();
        else
            layoutContainer.showPrevious();
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnBack:
                startActivity(new Intent(this, HomeActivity.class));
                finish();
                break;
            case R.id.btnCheckActivation:
                btnCheckActivation.setEnabled(false);
                Log.d("Login", String.valueOf(txtPhone.getText()));
                JsonObject objData = new JsonObject();
                objData.addProperty("phone", String.valueOf(txtPhone.getText()));
                final JsonObject obj = new JsonObject();
                obj.add("data",objData);
                Log.d("aaaaaaaaaaaaaaaaa", String.valueOf(obj));
                RESTClient.getTelehealthApi().checkActivation(obj, new Callback<JsonObject>() {
                    @Override
                    public void success(JsonObject jsonObject, Response response) {
                        UserUID = jsonObject.get("UserUID").getAsString();
                        Log.d("Succccccccccccccccccc", UserUID);
                        switchView(R.anim.in_from_left, R.anim.out_to_right, layoutRegisterFone);
                    }

                    @Override
                    public void failure(RetrofitError error) {
                        Log.d("error", String.valueOf(error));
                    }
                });
                break;
            case R.id.btnSubmitPinNumber:
                Log.d("Succccccccccccccccccc", UserUID);
                JsonObject objLogin = new JsonObject();
                objLogin.addProperty("UserUID", UserUID);
                objLogin.addProperty("PinNumber", String.valueOf(txtVerifyCode.getText()));
                objLogin.addProperty("UserName", "1");
                objLogin.addProperty("Password", "1");

                RESTClient.getAuthApi().login(objLogin, new Callback<JsonObject>() {
                    @Override
                    public void success(JsonObject jsonObject, Response response) {
                        Log.d("jsonObject", String.valueOf(jsonObject));
                        Log.d("response", String.valueOf(response));
                        SharedPreferences.Editor editor = workInjury.edit();
                        String token = jsonObject.get("token").getAsString();
                        String refreshCode = jsonObject.get("refreshCode").getAsString();
                        UserModel userModel = gson.fromJson(jsonObject.get("user").getAsJsonObject(), UserModel.class);
                        String useruid = (jsonObject.get("user").getAsJsonObject()).get("UID").getAsString();
                        String username = (jsonObject.get("user").getAsJsonObject()).get("UserName").getAsString();
                        for (RolesModel rolesModel : userModel.getRoles()) {
                            if (rolesModel.getRoleCode().equals("ORGANIZATION")){
                                Log.d("chiennnnnn",rolesModel.getID());
                                editor.putBoolean("isTypeCompany",true);
                            }
                        }
                        editor.putString("token", token);
                        editor.putString("refreshCode", refreshCode);
                        editor.putString("useruid", useruid);
                        editor.putString("username", username);
                        editor.putBoolean("isAuthenticated",true);
                        editor.commit();
                        JsonObject objData = new JsonObject();
                        objData.addProperty("uid",useruid);
                        objData.addProperty("token",workInjury.getString("deviceToken", ""));
                        RESTClient.getTelehealthApi().getTelehealthUser(objData, new Callback<JsonObject>() {
                            @Override
                            public void success(JsonObject jsonObject, Response response) {
                                Log.d("jsonObject", String.valueOf(jsonObject));
                                Log.d("response", String.valueOf(response));
                            }

                            @Override
                            public void failure(RetrofitError error) {

                            }
                        });
                        startActivity(new Intent(getApplicationContext(), HomeActivity.class));
                        finish();
                    }

                    @Override
                    public void failure(RetrofitError error) {

                    }
                });
                break;
            case R.id.btnForgetPin:
                JsonObject objForgetPin = new JsonObject();
                objForgetPin.addProperty("phone", String.valueOf(txtPhone.getText()));
                RESTClient.getTelehealthApi().forgetPin(objForgetPin, new Callback<JsonObject>() {
                    @Override
                    public void success(JsonObject jsonObject, Response response) {

                    }

                    @Override
                    public void failure(RetrofitError error) {

                    }
                });
                break;
        }
    }
}
