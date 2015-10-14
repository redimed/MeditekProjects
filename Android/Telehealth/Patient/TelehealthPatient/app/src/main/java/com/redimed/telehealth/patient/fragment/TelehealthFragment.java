package com.redimed.telehealth.patient.fragment;


import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.redimed.telehealth.patient.R;


/**
 * A simple {@link Fragment} subclass.
 */
public class TelehealthFragment extends Fragment {


    public TelehealthFragment() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_telehealth, container, false);
    }


}
