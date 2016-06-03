package patient.telehealth.redimed.workinjury.setting.presenter;

import android.support.v4.app.FragmentActivity;
import android.widget.Toast;
import com.google.gson.JsonObject;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.home.HomeFragment;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.setting.view.SettingView;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by MeditekMini on 5/23/16.
 */
public class SettingPresenter implements ISettingPresenter {

    private SettingView settingView;
    private FragmentActivity fragmentActivity;

    public SettingPresenter(SettingView settingView, FragmentActivity fragmentActivity) {
        this.settingView = settingView;
        this.fragmentActivity = fragmentActivity;
    }

    @Override
    public void Logout() {
        RESTClient.getAuthApi().logout(new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                MyApplication.getInstance().clearDataSharedPreferences();
                MyApplication.getInstance().replaceFragment(fragmentActivity, new HomeFragment());
                Toast.makeText(fragmentActivity, "success", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void failure(RetrofitError error) {

            }
        });
    }
}
