import { useQuasar } from 'quasar';

export default function useNotifier() {
  const $q = useQuasar();

  const notify = ({ message = 'Something happened!', type = 'positive', icon = null,}) =>{
    const iconMap = {
      positive: 'check_circle',
      negative: 'error',
      info: 'info',
      warning: 'warning',
    };

    $q.notify({
      message,
      color: type,
      icon: icon || iconMap[type],
    });
  };

  return {
    notify,
  };
}
