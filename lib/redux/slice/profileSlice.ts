import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import authService, { ProfileData } from "@/client-lib/service/auth-service";

interface ProfileState {
  data: ProfileData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  loading: false,
  error: null,
};

export const loadProfile = createAsyncThunk(
  "profile/loadProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.getProfile();
      return data;
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to load profile");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<ProfileData | null>) => {
      state.data = action.payload;
    },
    resetProfile: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProfile.fulfilled, (state:any, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(loadProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setProfile, resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
