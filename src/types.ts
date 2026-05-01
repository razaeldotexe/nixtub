export interface Translation {
  lang_name: string;
  description: string;
  welcome: string;
  prompt_url: string;
  prompt_format: string;
  manual_format: string;
  analyzing: string;
  table_title: string;
  table_uploader: string;
  table_duration: string;
  table_views: string;
  confirm_download: string;
  processing: string;
  status_downloading: string;
  status_finishing: string;
  status_done: string;
  success: string;
  error_no_url: string;
  error_fail_info: string;
  exit_msg: string;
  python_check: string;
}

export interface VideoInfo {
  title: string;
  uploader: string;
  duration: number;
  view_count: number;
  ext: string;
}

export interface DownloadOptions {
  format: string;
  outputTemplate: string;
}
