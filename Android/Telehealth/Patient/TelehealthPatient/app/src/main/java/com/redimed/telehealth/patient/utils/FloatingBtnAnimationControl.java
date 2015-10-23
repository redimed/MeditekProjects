package com.redimed.telehealth.patient.utils;

import android.support.v4.view.ViewCompat;
import android.support.v4.view.ViewPropertyAnimatorListenerAdapter;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.View;

import com.redimed.telehealth.patient.BuildConfig;

/**
 * Created by Lam on 10/22/2015.
 */
public class FloatingBtnAnimationControl extends RecyclerView.OnScrollListener {


    private static final int SCROLLING_UP = 1;
    private static final int SCROLLING_DOWN = 2;
    private int mScrollingDirection = 0;
    private boolean mIsScrollDirectionLocked = false;
    private long ANIMATION_DURATION = 175L;
    private boolean mIsAnimatingOff = false;
    private boolean mIsAnimatingOn = false;
    private View mButton;
    private boolean D = BuildConfig.DEBUG;
    private String TAG = "FAB_ANIMATION";
    public OnScrollingListener mListener;

    public interface OnScrollingListener {
        void onScrolled(RecyclerView recyclerView, int dx, int dy);

        void onScrollStateChanged(RecyclerView recyclerView, int newState);
    }

    public void setOnScrollingListener(OnScrollingListener listener) {
        mListener = listener;
    }

    public FloatingBtnAnimationControl(View button) {
        if (button == null) {
            Log.w(TAG, "View is null, nothing will be animated");
        }
        mButton = button;
    }

    public void setAnimationDuration(long duration) {
        ANIMATION_DURATION = duration;
    }

    public View getAnimatedView() {
        return mButton;
    }

    public void lockScrollingDirection() {
        mIsScrollDirectionLocked = true;
    }

    public void unlockScrollingDirection() {
        mIsScrollDirectionLocked = false;
    }

    public boolean isScrollDirectionLocked() {
        return mIsScrollDirectionLocked;
    }


    @Override
    public void onScrolled(RecyclerView recyclerView, int dx, int dy) {
        super.onScrolled(recyclerView, dx, dy);
        if (mButton == null || dy == 0) {
            return;
        }
        if (dy>0) { // Scrolling to bottom
            if (mIsScrollDirectionLocked && mScrollingDirection!=0) return;

            if (mButton.getVisibility()==View.GONE || mIsAnimatingOff) {
                return;
            } else {
                mScrollingDirection = SCROLLING_DOWN;
                mIsAnimatingOff = !mIsAnimatingOff;

                ViewCompat.setAlpha(mButton, 1f);
                ViewCompat.setTranslationY(mButton, 0F);

                ViewCompat.animate(mButton)
                        .alpha(0F)
                        .translationY(mButton.getHeight())
                        .setDuration(ANIMATION_DURATION)
                        .setListener(new ViewPropertyAnimatorListenerAdapter() {
                            @Override
                            public void onAnimationEnd(View view) {
                                mIsAnimatingOff = !mIsAnimatingOff;
                                if (D) Log.d(TAG, "Animation off screen Done!!!!");
                                mButton.setVisibility(View.GONE);
                            }
                        }).start();
            }
        } else { // Scrolling to top
            if (mIsScrollDirectionLocked && mScrollingDirection!=0) return;

            if (mButton.getVisibility()!=View.VISIBLE && !mIsAnimatingOn) {
                mScrollingDirection = SCROLLING_UP;
                mIsAnimatingOn = !mIsAnimatingOn;
                mButton.setVisibility(View.VISIBLE);

                ViewCompat.setAlpha(mButton, 0F);
                ViewCompat.setTranslationY(mButton, mButton.getHeight());

                ViewCompat.animate(mButton)
                        .alpha(1F)
                        .translationY(0F)
                        .setDuration(ANIMATION_DURATION)
                        .setListener(new ViewPropertyAnimatorListenerAdapter() {
                            @Override
                            public void onAnimationEnd(View view) {
                                mIsAnimatingOn = !mIsAnimatingOn;
                                if (D) Log.d(TAG, "Animation onto screen Done!!!!");
                            }
                        }).start();
            }
        }
        if (mListener!=null) { mListener.onScrolled(recyclerView, dx, dy); }
    }

    @Override
    public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
        super.onScrollStateChanged(recyclerView, newState);

        if (!mIsScrollDirectionLocked) return;

        switch (newState) {
            case RecyclerView.SCROLL_STATE_IDLE:
                mScrollingDirection = 0;
                break;

            default:
                break;
        }
        if (mListener!=null) { mListener.onScrollStateChanged(recyclerView, newState); }
    }
}
