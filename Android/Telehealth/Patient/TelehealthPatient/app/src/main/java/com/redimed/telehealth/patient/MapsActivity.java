package com.redimed.telehealth.patient;

import android.content.Intent;
import android.graphics.Color;
import android.support.v4.app.FragmentActivity;
import android.os.Bundle;
import android.util.Log;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.Polyline;
import com.google.android.gms.maps.model.PolylineOptions;
import com.google.maps.android.SphericalUtil;
import com.redimed.telehealth.patient.utils.GMapV2Direction;

import org.w3c.dom.Document;

import java.util.ArrayList;

import butterknife.Bind;

public class MapsActivity extends FragmentActivity implements OnMapReadyCallback {

    private Intent i;
    private GoogleMap mMap;
    private String TAG = "MAPS";
    private Double latitude, longitude;
    private Marker markerFrom, markerTo;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);

        i = getIntent();
        if (i.getExtras() != null){
            latitude = i.getExtras().getDouble("lat");
            longitude = i.getExtras().getDouble("long");
        }

        // initialize map
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager().findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
        GMapV2Direction md = new GMapV2Direction();
        Document doc = md.getDocument(new LatLng(latitude, longitude), new LatLng(10.838725, 106.675352), GMapV2Direction.MODE_DRIVING);

        ArrayList<LatLng> directionPoint = md.getDirection(doc);
        PolylineOptions rectLine = new PolylineOptions().width(3).color(Color.RED);
        for (int i = 0; i < directionPoint.size(); i++){
            rectLine.add(directionPoint.get(i));
        }
        Polyline polyline = mMap.addPolyline(rectLine);
        md.getDurationText(doc);
    }

    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     *
     * Google Maps API V2 is the native version of Google maps, while Google Maps API V3 is new API for web development.
     * We could use the API V3 and embed it into a WebView, but if you want to achieve the best result you should use Google Maps API V2 for Android.
     */

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        Log.d(TAG, latitude + " === " + longitude);

        // Showing Current Location
        mMap.setMyLocationEnabled(true);

        // Add a marker in current location
        LatLng location = new LatLng(latitude, longitude);
        markerFrom = mMap.addMarker(new MarkerOptions().position(location).title("Your location"));

        markerTo = mMap.addMarker(new MarkerOptions().position(new LatLng(10.838725, 106.675352)).title("Location 2"));

        // Move the camera
        CameraPosition cameraPosition = new CameraPosition.Builder().target(new LatLng(latitude, longitude)).zoom(14).build();
        mMap.animateCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));

        Log.d(TAG, computeDistance(markerFrom, markerTo) + " ");
    }

    private String computeDistance(Marker from, Marker to){
        double distance = SphericalUtil.computeDistanceBetween(from.getPosition(), to.getPosition());
        return formatNumber(distance);
    }

    private String formatNumber(double distance) {
        String unit = "m";
        if (distance < 1) {
            distance *= 1000;
            unit = "mm";
        } else if (distance > 1000) {
            distance /= 1000;
            unit = "km";
        }
        return String.format("%4.3f%s", distance, unit);
    }
}
