package patient.telehealth.redimed.workinjury.home.presenter;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.util.Log;

import com.google.gson.JsonObject;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.api.UrgentRequest;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by MeditekMini on 5/18/16.
 */
public class HomePresenter implements IHomepresenter {

    private String TAG = "HomePresenter";
    private UrgentRequest urgentRequestApi;
    private static SharedPreferences workinjury;
    private boolean isTypeCompany;
    private String UserUid;
    private Context context;


    public HomePresenter(Context context) {
        this.context = context;

        urgentRequestApi = RESTClient.getRegisterApi();
        workinjury = context.getSharedPreferences("WorkInjury", context.MODE_PRIVATE);

        CreateJsonDataSuburb();
    }

    @Override
    public void getDetailCompany() {
        RESTClient.getCoreApi().getDetailCompany(UserUid, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                Log.d(TAG + ">>>getDetailCompany :",jsonObject.get("data").getAsJsonArray()+"");
                String companyUid = ((jsonObject.get("data").getAsJsonArray()).get(0).getAsJsonObject()).get("UID").getAsString();
                String companyName = ((jsonObject.get("data").getAsJsonArray()).get(0).getAsJsonObject()).get("CompanyName").getAsString();
                SharedPreferences.Editor editor = workinjury.edit();
                editor.putString("companyUid",companyUid);
                editor.putString("companyName",companyName);
                editor.apply();
            }

            @Override
            public void failure(RetrofitError error) {

            }
        });
    }

    @Override
    public void CreateJsonDataSuburb() {
        File file = new File(
                "/data/data/" + context.getPackageName() + "/" + context.getResources().getString(R.string.fileName)
        );

        if (!file.exists()) {
            urgentRequestApi.getListSuburb(new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {
                    Log.d(TAG, ">>>>CreateJsonDataSuburb Success");
                    try {
                        FileWriter file = new FileWriter(
                                "/data/data/" + context.getPackageName() + "/" + context.getResources().getString(R.string.fileName)
                        );
                        file.write(String.valueOf(jsonObject));
                        file.flush();
                        file.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void failure(RetrofitError error) {
                    Log.d(TAG, error.getLocalizedMessage());
                }
            });
        }
    }

    @Override
    public void Contact() {
        Uri call = Uri.parse("tel:" + context.getResources().getString(R.string.phone_call));
        Intent phoneCallIntent = new Intent(Intent.ACTION_CALL, call);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (context.checkSelfPermission(Manifest.permission.CALL_PHONE) != PackageManager.PERMISSION_GRANTED) {
                context.startActivity(phoneCallIntent);
                return;
            }
        }
        context.startActivity(phoneCallIntent);
    }

    @Override
    public boolean isCompany() {
        isTypeCompany = workinjury.getBoolean("isTypeCompany", false);
        if (isTypeCompany){
            UserUid = workinjury.getString("useruid","");
            getDetailCompany();
        }
        return isTypeCompany;
    }

}
