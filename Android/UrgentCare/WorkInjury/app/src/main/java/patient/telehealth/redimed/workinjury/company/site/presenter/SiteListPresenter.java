package patient.telehealth.redimed.workinjury.company.site.presenter;
import com.google.gson.JsonObject;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.company.site.view.ISiteListView;
import patient.telehealth.redimed.workinjury.utils.Key;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by MeditekMini on 6/3/16.
 */
public class SiteListPresenter implements ISiteListPresenter {

    private MyApplication application;
    private String TAG = Key.Site.TAG;
    private ISiteListView iSiteListView;

    public SiteListPresenter(ISiteListView iSiteListView) {
        application = MyApplication.getInstance();
        this.iSiteListView = iSiteListView;
        LoadSiteList();
    }

    @Override
    public void LoadSiteList() {
        String uidCompany = String.valueOf(application.getDataSharedPreferences(Key.companyUid, Key.defalt));
        RESTClient.getCoreApi().getListSite(uidCompany, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                iSiteListView.LoadListSite(jsonObject);
            }

            @Override
            public void failure(RetrofitError error) {

            }
        });
    }
}
