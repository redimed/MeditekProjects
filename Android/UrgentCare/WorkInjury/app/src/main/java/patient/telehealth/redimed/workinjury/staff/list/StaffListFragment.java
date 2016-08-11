package patient.telehealth.redimed.workinjury.staff.list;

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
import patient.telehealth.redimed.workinjury.model.ModelStaff;
import patient.telehealth.redimed.workinjury.redisite.patient.PatientRedisiteFragment;
import patient.telehealth.redimed.workinjury.setting.SettingFragment;
import patient.telehealth.redimed.workinjury.staff.detail.StaffDetailFragment;
import patient.telehealth.redimed.workinjury.staff.list.presenter.IStaffListPresenter;
import patient.telehealth.redimed.workinjury.staff.list.presenter.StaffListPresenter;
import patient.telehealth.redimed.workinjury.staff.list.view.IStaffListView;
import patient.telehealth.redimed.workinjury.staff.list.adapter.AdapterStaff;
import patient.telehealth.redimed.workinjury.utils.Key;
import patient.telehealth.redimed.workinjury.utils.Key.Work;
import patient.telehealth.redimed.workinjury.utils.Key.Staff;
import patient.telehealth.redimed.workinjury.utils.Key.Redisite;
import patient.telehealth.redimed.workinjury.work.WorkFragment;


/**
 * A simple {@link Fragment} subclass.
 */
public class StaffListFragment extends Fragment implements IStaffListView, AdapterStaff.OnClickStaff {

    IStaffListPresenter iStaffListPresenter;
    Gson gson;
    AdapterStaff staffAdapter;
    ModelStaff[] data;
    MyApplication application;
    private Boolean fmWork;
    private Boolean fmRedisite;



    @Bind(R.id.staffRecyclerView) RecyclerView staffView;

    public StaffListFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        iStaffListPresenter = new StaffListPresenter(this);
        gson = new Gson();
        application = MyApplication.getInstance();
        fmWork = false;
        fmRedisite = false;
        if (getArguments() != null){
            fmWork = getArguments().getBoolean(Work.name, false);
            fmRedisite = getArguments().getBoolean(Redisite.name, false);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_staff_list, container, false);
        ButterKnife.bind(this, view);
        setHasOptionsMenu(true);
        application.createTooBar(view, getActivity(), Key.fmStaffList);
        return view;
    }

    @Override
    public void StaffList(JsonObject object) {
        data = gson.fromJson(object.get(Staff.data).toString(), ModelStaff[].class);
        staffAdapter = new AdapterStaff(getActivity(),data, this);
        staffView.setAdapter(staffAdapter);
        staffView.setLayoutManager(new LinearLayoutManager(getActivity()));
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
    public void StaffItemClick(String UID) {
        Bundle bundle = new Bundle();
        bundle.putString(Staff.staffUid, UID);
        if (fmWork){
            WorkFragment fragment = new WorkFragment();
            fragment.setArguments(bundle);
            application.replaceFragment(getActivity(), fragment, Key.fmWork, Key.fmStaffList);
        }else if (fmRedisite){
            PatientRedisiteFragment fragment = new PatientRedisiteFragment();
            fragment.setArguments(bundle);
            application.replaceFragment(getActivity(), fragment, Key.fmRedisitePatient, Key.fmHome);
        }else {
            StaffDetailFragment fragment = new StaffDetailFragment();
            fragment.setArguments(bundle);
            application.replaceFragment(getActivity(), fragment, Key.fmStaffDetail, Key.fmStaffList);
        }
    }
}
