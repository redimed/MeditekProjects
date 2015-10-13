package com.redimed.telehealth.patient;

import android.app.ListActivity;
import android.content.Intent;
import android.content.res.TypedArray;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;


import com.redimed.telehealth.patient.utils.CountryListArrayAdapter;

import java.util.ArrayList;
import java.util.List;

public class CountryCodeActivity extends ListActivity {

    public static String RESULT_COUNTRY_CODE = "CountryCode";
    public String[] listCountryNames, listCountryCodes;
    private TypedArray arrImg;
    private List<Country> countryList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

//        CountryList();
        ArrayAdapter<Country> countryArrayAdapter = new CountryListArrayAdapter(this, countryList);
        setListAdapter(countryArrayAdapter);

//        Listen event click in Dialog and return country code
        getListView().setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Country country = countryList.get(position);
                Intent i = new Intent();
                i.putExtra(RESULT_COUNTRY_CODE, country.getCode());
                setResult(RESULT_OK, i);
                arrImg.recycle();
                finish();
            }
        });
    }

//    Initialize object Country storage name, code, image
    public class Country {
        private String name;
        private String code;
        private Drawable flag;

        public Country(String name, String code, Drawable flag){
            this.name = name;
            this.code = code;
            this.flag = flag;
        }
        public String getName() {
            return name;
        }
        public Drawable getFlag() {
            return flag;
        }
        public String getCode() {
            return code;
        }
    }
}
