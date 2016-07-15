package patient.telehealth.redimed.workinjury.setting.presenter;

import android.app.Activity;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import com.google.gson.JsonObject;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.faq.FAQsFragment;
import patient.telehealth.redimed.workinjury.home.HomeFragment;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.setting.view.SettingView;
import patient.telehealth.redimed.workinjury.utils.Key;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by MeditekMini on 5/23/16.
 */
public class SettingPresenter implements ISettingPresenter {

    private SettingView settingView;
    private AppCompatActivity activity;
    private MyApplication application;

    public SettingPresenter(SettingView settingView, Activity activity) {
        this.settingView = settingView;
        this.activity = (AppCompatActivity) activity;

        application = MyApplication.getInstance();
    }

    @Override
    public void Logout() {
        RESTClient.getAuthApi().logout(new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                application.clearDataSharedPreferences();
                application.replaceFragment(activity, new HomeFragment(),"Home",null);
            }

            @Override
            public void failure(RetrofitError error) {

            }
        });
    }

    @Override
    public void displayFAQs(String content) {
        FAQsFragment fragment = new FAQsFragment();
        Bundle bundle = new Bundle();
        bundle.putString("msg", content);
        fragment.setArguments(bundle);
        application.replaceFragment(activity, fragment, Key.fmFAQs, activity.getString(R.string.setting));
        //fragment.Back(activity.getString(R.string.setting));
    }
}
