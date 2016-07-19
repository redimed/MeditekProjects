package com.redimed.telehealth.patient.adapter;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentStatePagerAdapter;
import android.util.Log;

import com.redimed.telehealth.patient.appointment.AppointmentFragment;
import com.redimed.telehealth.patient.appointment_images.ImagesAppointmentFragment;
import com.redimed.telehealth.patient.eform.EFormFragment;

import java.util.ArrayList;

public class TabsPagerAdapter extends FragmentStatePagerAdapter {

    private String uidAppt;
    private ArrayList<String> listImg;
    private static final String TAG = "=====TAB ADAPTER=====";

    // Tab Titles
    private String[] tabTitles = {"Appointment Details", "Images Appointment", "EForm"};

    public TabsPagerAdapter(FragmentManager fragmentManager, String uidAppt, ArrayList<String> listImg) {
        super(fragmentManager);
        this.uidAppt = uidAppt;
        this.listImg = listImg;
    }

    @Override
    public int getItemPosition(Object object) {
        return super.getItemPosition(object);
    }

    @Override
    public Fragment getItem(int index) {
        switch (index) {
            case 0:
                Bundle bundleAppt = new Bundle();
                bundleAppt.putString("apptUID", uidAppt);

                Fragment fragmentAppt = new AppointmentFragment();
                fragmentAppt.setArguments(bundleAppt);
                return fragmentAppt;
            case 1:
                Bundle bundleImageAppt = new Bundle();
                bundleImageAppt.putString("apptUID", uidAppt);
                bundleImageAppt.putStringArrayList("listImg", listImg);

                Fragment fragmentImageAppt = new ImagesAppointmentFragment();
                fragmentImageAppt.setArguments(bundleImageAppt);
                return fragmentImageAppt;
            case 2:
                Bundle bundleEForm = new Bundle();
                bundleEForm.putString("apptUID", uidAppt);
                Log.d(TAG, uidAppt);

                Fragment fragmentEForm = new EFormFragment();
                fragmentEForm.setArguments(bundleEForm);
                return fragmentEForm;
        }
        return null;
    }

    @Override
    public int getCount() {
        // get item count - equal to number of tabs
        return tabTitles.length;
    }

    @Override
    public CharSequence getPageTitle(int position) {
        return tabTitles[position];
    }

}
