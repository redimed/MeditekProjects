package patient.telehealth.redimed.workinjury.site;


import android.os.Bundle;
import android.support.annotation.Nullable;
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
import patient.telehealth.redimed.workinjury.company.CompanyDetailFragment;
import patient.telehealth.redimed.workinjury.models.ModelSite;
import patient.telehealth.redimed.workinjury.site.presenter.ISiteListPresenter;
import patient.telehealth.redimed.workinjury.site.presenter.SiteListPresenter;
import patient.telehealth.redimed.workinjury.site.view.ISiteListView;
import patient.telehealth.redimed.workinjury.site.adapter.AdapterSite;
import patient.telehealth.redimed.workinjury.utils.Key;


/**
 * A simple {@link Fragment} subclass.
 */
public class SiteListFragment extends Fragment implements ISiteListView, AdapterSite.OnClickSite {

    private MyApplication application;
    private ISiteListPresenter iSiteListPresenter;
    private Gson gson;
    private ModelSite[] data;
    private AdapterSite listSiteAdapter;

    @Bind(R.id.siteRecyclerView) RecyclerView SiteView;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        application = MyApplication.getInstance();
        this.iSiteListPresenter = new SiteListPresenter(this);
        gson = new Gson();

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
        data = gson.fromJson(object.get(Key.Site.data).toString(), ModelSite[].class);
        listSiteAdapter = new AdapterSite(getActivity(), data, this);
        SiteView.setAdapter(listSiteAdapter);
        SiteView.setLayoutManager(new LinearLayoutManager(getActivity()));
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                application.BackFragment(getActivity(),null,null);
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public void SiteItemClick(String UID) {
        CompanyDetailFragment fragment = new CompanyDetailFragment();
        Bundle bundle = new Bundle();
        bundle.putString(Key.Site.siteUid, UID);
        fragment.setArguments(bundle);
        application.replaceFragment(getActivity(), fragment, Key.fmCompanyDetail, Key.fmSiteList);
    }
}
