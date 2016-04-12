package patient.telehealth.redimed.workinjury;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import com.google.gson.JsonObject;

import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class LoginActivity extends AppCompatActivity implements View.OnClickListener {

    @Bind(R.id.btnCheckActivation) Button btnCheckActivation;
    @Bind(R.id.txtPhone) EditText txtPhone;
    @Bind(R.id.btnCheckPinNumber) Button btnCheckPinNumber;
    @Bind(R.id.txtPinNumber) EditText txtPinNumber;
    @Bind(R.id.btnLogout) Button btnLogout;
    private String UserUID;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        ButterKnife.bind(this);
        btnCheckActivation.setOnClickListener(this);
        btnCheckPinNumber.setOnClickListener(this);
        btnLogout.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.btnCheckActivation :
                Log.d("Login", String.valueOf(txtPhone.getText()));
                JsonObject objData = new JsonObject();
                objData.addProperty("phone", String.valueOf(txtPhone.getText()));
                JsonObject obj = new JsonObject();
                obj.add("data",objData);
                Log.d("aaaaaaaaaaaaaaaaa", String.valueOf(obj));
                RESTClient.getTelehealthApi().checkActivation(obj, new Callback<JsonObject>() {
                    @Override
                    public void success(JsonObject jsonObject, Response response) {
                        UserUID = jsonObject.get("UserUID").getAsString();
                        Log.d("Succccccccccccccccccc", UserUID);
                    }

                    @Override
                    public void failure(RetrofitError error) {
                        Log.d("error", String.valueOf(error));
                    }
                });
                break;
            case R.id.btnCheckPinNumber :
                Log.d("Succccccccccccccccccc", UserUID);
                JsonObject objLogin = new JsonObject();
                objLogin.addProperty("UserUID", UserUID);
                objLogin.addProperty("PinNumber", String.valueOf(txtPinNumber.getText()));
                objLogin.addProperty("UserName", "1");
                objLogin.addProperty("Password", "1");


                RESTClient.getAuthApi().login(objLogin, new Callback<JsonObject>() {
                    @Override
                    public void success(JsonObject jsonObject, Response response) {
                        Log.d("jsonObject", String.valueOf(jsonObject));
                        Log.d("response", String.valueOf(response));
                        SharedPreferences.Editor editor = getSharedPreferences("WorkInjury", MODE_PRIVATE).edit();
                        String token = jsonObject.get("token").getAsString();
//                        String user = jsonObject.get("user").getAsString();
                        editor.putString("token", token);
//                        editor.putString("user", user);
                        editor.commit();
                    }

                    @Override
                    public void failure(RetrofitError error) {

                    }
                });
                break;
            case R.id.btnLogout:
                RESTClient.getAuthApi().logout(new Callback<JsonObject>() {
                    @Override
                    public void success(JsonObject jsonObject, Response response) {
                        Log.d("Logout", String.valueOf(jsonObject));
                    }

                    @Override
                    public void failure(RetrofitError error) {

                    }
                });
                break;

        }
    }
}
