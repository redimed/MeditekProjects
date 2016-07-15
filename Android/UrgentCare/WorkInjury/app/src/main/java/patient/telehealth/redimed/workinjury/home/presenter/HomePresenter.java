package patient.telehealth.redimed.workinjury.home.presenter;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;

import com.google.gson.JsonObject;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.api.UrgentRequest;
import patient.telehealth.redimed.workinjury.faq.FAQsFragment;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.utils.Key;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by MeditekMini on 5/18/16.
 */
public class HomePresenter implements IHomepresenter {

    private String TAG = Key.Home.TAG;
    private UrgentRequest urgentRequestApi;
    private MyApplication application;
    private Context context;
    private AppCompatActivity activity;


    public HomePresenter(Context context, Activity activity) {
        this.context = context;
        this.activity = (AppCompatActivity) activity;
        application = MyApplication.getInstance();
        urgentRequestApi = RESTClient.getRegisterApi();

        CreateJsonDataSuburb();
    }

    @Override
    public void getDetailCompany() {
        String UserUid = (String) application.getDataSharedPreferences(Key.useruid, Key.defalt);

        RESTClient.getCoreApi().getDetailCompany(UserUid, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String companyUid = ((jsonObject.get(Key.Home.data).getAsJsonArray()).get(0).getAsJsonObject()).get(Key.Home.UID).getAsString();
                String companyName = ((jsonObject.get(Key.Home.data).getAsJsonArray()).get(0).getAsJsonObject()).get(Key.Home.CompanyName).getAsString();
                application.setDataSharedPreferences(Key.companyUid, companyUid);
                application.setDataSharedPreferences(Key.companyName, companyName);
            }

            @Override
            public void failure(RetrofitError error) {

            }
        });
    }

    @Override
    public void CreateJsonDataSuburb() {
        File file = new File(
                Key.locationFileSuburb + context.getPackageName() + Key.fileSuburb
        );

        if (!file.exists()) {
            urgentRequestApi.getListSuburb(new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {
                    Log.d(TAG, ">>>>CreateJsonDataSuburb Success");
                    try {
                        FileWriter file = new FileWriter(
                                Key.locationFileSuburb + context.getPackageName() + Key.fileSuburb
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
        Uri call = Uri.parse(Key.telCall);
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
    public boolean isLogin() {
        boolean isLogin = (boolean) application.getDataSharedPreferences(Key.isAuthenticated, false);
        if (isLogin){
            boolean isTypeCompany = (boolean) application.getDataSharedPreferences(Key.isTypeCompany, false);
            if (isTypeCompany){
                getDetailCompany();
            }
        }
        return isLogin;
    }

    @Override
    public void displayFAQs(String content) {
        FAQsFragment fragment = new FAQsFragment();
        Bundle bundle = new Bundle();
        bundle.putString(Key.Home.msg, content);
        fragment.setArguments(bundle);
        application.replaceFragment(activity, fragment, Key.fmFAQs, Key.fmHome);
    }

}
