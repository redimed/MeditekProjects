package patient.telehealth.redimed.workinjury.staff;


import android.content.Context;
import android.os.Bundle;
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
import patient.telehealth.redimed.workinjury.models.ModelStaff;
import patient.telehealth.redimed.workinjury.staff.presenter.IStaffListPresenter;
import patient.telehealth.redimed.workinjury.staff.presenter.StaffListPresenter;
import patient.telehealth.redimed.workinjury.staff.view.IStaffListView;
import patient.telehealth.redimed.workinjury.staff.adapter.AdapterStaff;
import patient.telehealth.redimed.workinjury.utils.Key;


/**
 * A simple {@link Fragment} subclass.
 */
public class StaffListFragment extends Fragment implements IStaffListView, AdapterStaff.OnClickStaff {

    private IStaffListPresenter iStaffListPresenter;
    private Gson gson;
    private AdapterStaff staffAdapter;
    private ModelStaff[] data;
    private MyApplication application;

    @Bind(R.id.staffRecyclerView) RecyclerView staffView;

    public StaffListFragment() {
        // Required empty public constructor
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

        iStaffListPresenter = new StaffListPresenter(this);
        gson = new Gson();
        application = MyApplication.getInstance();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_staff_list, container, false);
        ButterKnife.bind(this, view);
        setHasOptionsMenu(true);

        application.createTooBar(view, getActivity(),getString(R.string.staff_list));

        return view;
    }

    @Override
    public void StaffList(JsonObject object) {
        data = gson.fromJson(object.get("data").toString(), ModelStaff[].class);
        staffAdapter = new AdapterStaff(getActivity(),data, this);
        staffView.setAdapter(staffAdapter);
        staffView.setLayoutManager(new LinearLayoutManager(getActivity()));
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                application.BackFragment(getActivity(),getString(R.string.setting),getString(R.string.setting));
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public void StaffItemClick(String UID) {
        StaffDetailFragment fragment = new StaffDetailFragment();
        Bundle bundle = new Bundle();
        bundle.putString("staffUid", UID);
        fragment.setArguments(bundle);
        application.replaceFragment(getActivity(), fragment, Key.fmStaffDetail,getString(R.string.staff_list));
    }
}
