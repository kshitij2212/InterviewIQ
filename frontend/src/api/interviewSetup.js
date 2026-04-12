import axiosInstance from '../utils/axiosInstance'

export const interviewSetupApi = {
  options: () => axiosInstance.get('/interviews/options'),
}
