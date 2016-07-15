package patient.telehealth.redimed.workinjury.staff;


import android.content.Context;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.models.ModelPatient;
import patient.telehealth.redimed.workinjury.staff.presenter.IStaffDetailPresenter;
import patient.telehealth.redimed.workinjury.staff.presenter.StaffDetailPresenter;
import patient.telehealth.redimed.workinjury.staff.view.IStaffDetailView;
import patient.telehealth.redimed.workinjury.utils.Key;


/**
 * A simple {@link Fragment} subclass.
 */
public class StaffDetailFragment extends Fragment implements IStaffDetailView {

    private MyApplication application;
    private IStaffDetailPresenter iStaffDetailPresenter;

    @Bind(R.id.lblFirstName) TextView lblFirstName;
    @Bind(R.id.lblMiddleName) TextView lblMiddleName;
    @Bind(R.id.lblLastName) TextView lblLastName;
    @Bind(R.id.lblHomePhoneNumber) TextView lblHomePhoneNumber;
    @Bind(R.id.lblDOB) TextView lblDOB;
    @Bind(R.id.lblEmail1) TextView lblEmail1;
    @Bind(R.id.lblAddress1) TextView lblAddress1;
    @Bind(R.id.lblSuburb) TextView lblSuburb;
    @Bind(R.id.lblPostcode) TextView lblPostcode;

    public StaffDetailFragment() {
        // Required empty public constructor
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        application = MyApplication.getInstance();
        iStaffDetailPresenter = new StaffDetailPresenter(context, this);
        iStaffDetailPresenter.getDetailStaff(getArguments());
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_staff_detail, container, false);
        ButterKnife.bind(this, view);
        setHasOptionsMenu(true);
        application.createTooBar(view,getActivity(), Key.fmStaffDetail);


        return view;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                application.BackFragment(getActivity(),getString(R.string.staff_list), getString(R.string.staff_list));
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public void StaffDetail(ModelPatient modelPatient) {
        lblFirstName.setText(modelPatient.getFirstName());
        lblMiddleName.setText(modelPatient.getMiddleName());
        lblLastName.setText(modelPatient.getLastName());
        lblHomePhoneNumber.setText(modelPatient.getHomePhoneNumber());
        lblDOB.setText(modelPatient.getDOB());
        lblAddress1.setText(modelPatient.getAddress1());
        lblEmail1.setText(modelPatient.getEmail1());
        lblSuburb.setText(modelPatient.getSuburb());
        lblPostcode.setText(modelPatient.getPostcode());
    }
}
