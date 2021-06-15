import { AccountService } from '../_services';

export function appInitializer(accountService: AccountService) {
  return () =>
    new Promise(resolve => {
      // refresh token to auto authenticate
      accountService
        .refreshToken()
        .subscribe()
        .add(resolve);
    });
}
