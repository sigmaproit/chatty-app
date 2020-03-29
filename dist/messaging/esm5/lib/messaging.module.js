/**
 * @fileoverview added by tsickle
 * Generated from: lib/messaging.module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBoxComponent } from "./chat-box/chat-box.component";
import { MessagingService } from "./chat-box/messaging.service";
import { BrowserModule } from '@angular/platform-browser';
import { MaterialImportsModule } from "./material-imports/material-imports.module";
import { FormsModule } from '@angular/forms';
var MessagingModule = /** @class */ (function () {
    function MessagingModule() {
    }
    /**
     * @param {?} config
     * @return {?}
     */
    MessagingModule.forRoot = /**
     * @param {?} config
     * @return {?}
     */
    function (config) {
        return {
            ngModule: MessagingModule,
            providers: [MessagingService, { provide: 'config', useValue: config }]
        };
    };
    MessagingModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [ChatBoxComponent],
                    imports: [
                        CommonModule,
                        BrowserModule,
                        MaterialImportsModule,
                        FormsModule
                    ],
                    exports: [ChatBoxComponent],
                    providers: []
                },] }
    ];
    return MessagingModule;
}());
export { MessagingModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnaW5nLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2NoYXR0eS1mcm9udGVuZC8iLCJzb3VyY2VzIjpbImxpYi9tZXNzYWdpbmcubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFzQixRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQy9ELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQzlELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUN4RCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSw0Q0FBNEMsQ0FBQztBQUNqRixPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0M7SUFBQTtJQWtCQSxDQUFDOzs7OztJQU5RLHVCQUFPOzs7O0lBQWQsVUFBZSxNQUFXO1FBQ3hCLE9BQU87WUFDTCxRQUFRLEVBQUUsZUFBZTtZQUN6QixTQUFTLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBQyxDQUFDO1NBQ3JFLENBQUM7SUFDSixDQUFDOztnQkFqQkYsUUFBUSxTQUFDO29CQUNSLFlBQVksRUFBRSxDQUFDLGdCQUFnQixDQUFDO29CQUNoQyxPQUFPLEVBQUU7d0JBQ1AsWUFBWTt3QkFDWixhQUFhO3dCQUNiLHFCQUFxQjt3QkFDckIsV0FBVztxQkFDWjtvQkFDRCxPQUFPLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDM0IsU0FBUyxFQUFFLEVBQUU7aUJBQ2Q7O0lBUUQsc0JBQUM7Q0FBQSxBQWxCRCxJQWtCQztTQVBZLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge01vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0NoYXRCb3hDb21wb25lbnR9IGZyb20gXCIuL2NoYXQtYm94L2NoYXQtYm94LmNvbXBvbmVudFwiO1xuaW1wb3J0IHtNZXNzYWdpbmdTZXJ2aWNlfSBmcm9tIFwiLi9jaGF0LWJveC9tZXNzYWdpbmcuc2VydmljZVwiO1xuaW1wb3J0IHtCcm93c2VyTW9kdWxlfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7TWF0ZXJpYWxJbXBvcnRzTW9kdWxlfSBmcm9tIFwiLi9tYXRlcmlhbC1pbXBvcnRzL21hdGVyaWFsLWltcG9ydHMubW9kdWxlXCI7XG5pbXBvcnQge0Zvcm1zTW9kdWxlfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW0NoYXRCb3hDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIEJyb3dzZXJNb2R1bGUsXG4gICAgTWF0ZXJpYWxJbXBvcnRzTW9kdWxlLFxuICAgIEZvcm1zTW9kdWxlXG4gIF0sXG4gIGV4cG9ydHM6IFtDaGF0Qm94Q29tcG9uZW50XSxcbiAgcHJvdmlkZXJzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBNZXNzYWdpbmdNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdChjb25maWc6IGFueSk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogTWVzc2FnaW5nTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbTWVzc2FnaW5nU2VydmljZSwge3Byb3ZpZGU6ICdjb25maWcnLCB1c2VWYWx1ZTogY29uZmlnfV1cbiAgICB9O1xuICB9XG59XG4iXX0=