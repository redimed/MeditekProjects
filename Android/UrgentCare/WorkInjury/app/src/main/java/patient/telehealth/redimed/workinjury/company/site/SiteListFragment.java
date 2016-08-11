package patient.telehealth.redimed.workinjury.company.site;


import android.os.Bundle;
import android.support.v4.app.DialogFragment;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.company.detail.CompanyDetailFragment;
import patient.telehealth.redimed.workinjury.model.ModelSite;
import patient.telehealth.redimed.workinjury.redisite.patient.PatientRedisiteFragment;
import patient.telehealth.redimed.workinjury.setting.SettingFragment;
import patient.telehealth.redimed.workinjury.company.site.presenter.ISiteListPresenter;
import patient.telehealth.redimed.workinjury.company.site.presenter.SiteListPresenter;
import patient.telehealth.redimed.workinjury.company.site.view.ISiteListView;
import patient.telehealth.redimed.workinjury.company.site.adapter.AdapterSite;
import patient.telehealth.redimed.workinjury.utils.Key;
import patient.telehealth.redimed.workinjury.utils.Key.Work;
import patient.telehealth.redimed.workinjury.utils.Key.Site;
import patient.telehealth.redimed.workinjury.utils.Key.Redisite;
import patient.telehealth.redimed.workinjury.work.WorkFragment;


/**
 * A simple {@link Fragment} subclass.
 */
public class SiteListFragment extends DialogFragment implements ISiteListView, AdapterSite.OnClickSite {

    private MyApplication application;
    private ISiteListPresenter iSiteListPresenter;
    private Gson gson;
    private ModelSite[] data;
    private AdapterSite listSiteAdapter;
    private Boolean fmWork;
    private Boolean fmRedisite;

    @Bind(R.id.siteRecyclerView) RecyclerView SiteView;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        application = MyApplication.getInstance();
        this.iSiteListPresenter = new SiteListPresenter(this);
        gson = new Gson();
        fmWork = false;
        fmRedisite = false;
        if (getArguments() != null){
            fmWork = getArguments().getBoolean(Work.name, false);
            fmRedisite = getArguments().getBoolean(Redisite.name, false);
        }
    }

    public SiteListFragment() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_site_list, container, false);
        ButterKnife.bind(this, view);
        setHasOptionsMenu(true);
        application.createTooBar(view, getActivity(), Key.fmSiteList);

        return view;
    }

    @Override
    public void LoadListSite(JsonObject object) {
        data = gson.fromJson(object.get(Site.data).toString(), ModelSite[].class);
        listSiteAdapter = new AdapterSite(getActivity(), data, this);
        SiteView.setAdapter(listSiteAdapter);
        SiteView.setLayoutManager(new LinearLayoutManager(getActivity()));
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                if (fmWork){
                    application.replaceFragment(getActivity(), new WorkFragment(), Key.fmWork, Key.fmHome);
                }else if (fmRedisite){
                    application.replaceFragment(getActivity(), new PatientRedisiteFragment(), Key.fmRedisitePatient, Key.fmHome);
                }else {
                    application.replaceFragment(getActivity(), new SettingFragment(), Key.fmSetting, Key.fmHome);
                }
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public void SiteItemClick(String UID) {
        Bundle bundle = new Bundle();
        bundle.putString(Site.siteUid, UID);
        if (fmWork){
            WorkFragment fragment = new WorkFragment();
            fragment.setArguments(bundle);
            application.replaceFragment(getActivity(), fragment, Key.fmWork, Key.fmSiteList);
        }else if (fmRedisite){
            PatientRedisiteFragment fragment = new PatientRedisiteFragment();
            fragment.setArguments(bundle);
            application.replaceFragment(getActivity(), fragment, Key.fmRedisitePatient, Key.fmHome);
        }else {
            CompanyDetailFragment fragment = new CompanyDetailFragment();
            fragment.setArguments(bundle);
            application.replaceFragment(getActivity(), fragment, Key.fmCompanyDetail, Key.fmSiteList);
        }
    }
}
