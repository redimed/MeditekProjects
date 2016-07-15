package patient.telehealth.redimed.workinjury.company.presenter;

import android.os.Bundle;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.models.ModelCompany;
import patient.telehealth.redimed.workinjury.company.view.ICompanyDetailView;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by MeditekMini on 6/3/16.
 */
public class CompanyDetailPresenter implements ICompanyDetailPresenter {

    private String TAG = "CompanyDetailPresenter";
    private MyApplication application;
    private ICompanyDetailView iCompanyDetailView;
    private ModelCompany modelCompany;
    private Gson gson;

    public CompanyDetailPresenter(ICompanyDetailView iCompanyDetailView) {
        this.iCompanyDetailView = iCompanyDetailView;

        application = MyApplication.getInstance();
        gson = new Gson();
    }

    @Override
    public void getDetailCompany(Bundle bundle) {
        String siteUid = bundle.getString("siteUid");
        JsonObject objData = new JsonObject();
        objData.addProperty("data", application.parseToJson(new String[]{"model", "CompanySite", "UID" ,siteUid}));

        RESTClient.getCoreApi().getDetailSite(objData, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                modelCompany = gson.fromJson(jsonObject.get("data").getAsJsonObject(), ModelCompany.class);
                iCompanyDetailView.LoadCompanyDetail(modelCompany);
            }

            @Override
            public void failure(RetrofitError error) {

            }
        });
    }
}
