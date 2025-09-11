// @ts-nocheck
import {
    IExecuteFunctions,
} from 'n8n-core';

import {
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

export class Bookstore implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Bookstore',
        name: 'bookstore',
        icon: 'fa:book', // or any icon you prefer
        group: ['transform'],
        version: 1,
        description: 'Manage books and orders in a bookstore',
        defaults: {
            name: 'Bookstore',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            //------------------------------------------------------------------
            //          RESOURCE SELECTION
            //------------------------------------------------------------------
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                options: [
                    {
                        name: 'Book',
                        value: 'book',
                    },
                    {
                        name: 'Order',
                        value: 'order',
                    },
                ],
                description: 'Select which resource to operate on',
            },

            //------------------------------------------------------------------
            //          BOOK OPERATIONS
            //------------------------------------------------------------------
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                displayOptions: {
                    show: {
                        resource: [
                            'book',
                        ],
                    },
                },
                options: [
                    {
                        name: 'List All Books',
                        value: 'listAllBooks',
                        description: 'Retrieve a list of all books',
                        action: 'List All Books',
                    },
                    {
                        name: 'Register a New Book',
                        value: 'registerNewBook',
                        description: 'Add a new book to the inventory',
                        action: 'Register a New Book',
                    },
                ],
                description: 'Select an operation for Book',
            },

            //------------------------------------------------------------------
            //          ORDER OPERATIONS
            //------------------------------------------------------------------
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                displayOptions: {
                    show: {
                        resource: [
                            'order',
                        ],
                    },
                },
                options: [
                    {
                        name: 'List All Orders',
                        value: 'listAllOrders',
                        description: 'Retrieve a list of all orders',
                        action: 'List All Orders',
                    },
                    {
                        name: 'Create a New Order',
                        value: 'createNewOrder',
                        description: 'Create a new order with one or more books',
                        action: 'Create a New Order',
                    },
                    {
                        name: 'Update Order',
                        value: 'updateOrder',
                        description: 'Update the status or details of an existing order',
                        action: 'Update Order',
                    },
                ],
                description: 'Select an operation for Order',
            },

            //------------------------------------------------------------------
            //          BOOK PARAMETERS
            //------------------------------------------------------------------
            {
                displayName: 'Book Name',
                name: 'bookName',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: [
                            'book',
                        ],
                        operation: [
                            'registerNewBook',
                        ],
                    },
                },
                default: '',
                required: true,
                description: 'The name (title) of the book to register',
            },

            //------------------------------------------------------------------
            //          ORDER PARAMETERS
            //------------------------------------------------------------------
            // Create a new order
            {
                displayName: 'Book IDs',
                name: 'bookIds',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: [
                            'order',
                        ],
                        operation: [
                            'createNewOrder',
                        ],
                    },
                },
                default: '',
                required: true,
                description: 'Comma-separated list of book IDs included in the new order',
            },
            // Update an order
            {
                displayName: 'Order ID',
                name: 'orderId',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: [
                            'order',
                        ],
                        operation: [
                            'updateOrder',
                        ],
                    },
                },
                default: '',
                required: true,
                description: 'The ID of the order to update',
            },
            {
                displayName: 'New Status',
                name: 'newStatus',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: [
                            'order',
                        ],
                        operation: [
                            'updateOrder',
                        ],
                    },
                },
                default: '',
                required: true,
                description: 'The new status of the order (e.g. "shipped", "completed")',
            },
        ],
    };

    //------------------------------------------------------------------
    //          EXECUTION LOGIC
    //------------------------------------------------------------------
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][] | null> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            // Read resource & operation
            const resource = this.getNodeParameter('resource', itemIndex) as string;
            const operation = this.getNodeParameter('operation', itemIndex) as string;

            let responseData: any = {};

            try {
                if (resource === 'book') {
                    switch (operation) {
                        //--------------------------------------------------------
                        //     LIST ALL BOOKS
                        //--------------------------------------------------------
                        case 'listAllBooks': {
                            // In a real scenario, you'd fetch data from a DB or API.
                            // Here we mock with sample data:
                            const books = [
                                { bookId: 'B001', bookName: '1984' },
                                { bookId: 'B002', bookName: 'Brave New World' },
                                { bookId: 'B003', bookName: 'Fahrenheit 451' },
                            ];
                            responseData = {
                                success: true,
                                books,
                            };
                            break;
                        }
                        //--------------------------------------------------------
                        //     REGISTER A NEW BOOK
                        //--------------------------------------------------------
                        case 'registerNewBook': {
                            const bookName = this.getNodeParameter('bookName', itemIndex) as string;
                            // In a real scenario, you'd store this data in a DB or via an API.
                            responseData = {
                                success: true,
                                message: `Book "${bookName}" registered successfully.`,
                            };
                            break;
                        }
                        default:
                            throw new Error(`Unsupported Book operation: ${operation}`);
                    }
                } else if (resource === 'order') {
                    switch (operation) {
                        //--------------------------------------------------------
                        //     LIST ALL ORDERS
                        //--------------------------------------------------------
                        case 'listAllOrders': {
                            // Mock order data
                            const orders = [
                                { id: 'O1001', bookIds: ['B001', 'B002'], status: 'pending' },
                                { id: 'O1002', bookIds: ['B003'], status: 'shipped' },
                                { id: 'O1003', bookIds: ['B001', 'B003'], status: 'completed' },
                            ];
                            responseData = {
                                success: true,
                                orders,
                            };
                            break;
                        }
                        //--------------------------------------------------------
                        //     CREATE A NEW ORDER
                        //--------------------------------------------------------
                        case 'createNewOrder': {
                            const bookIdsStr = this.getNodeParameter('bookIds', itemIndex) as string;
                            // Example of parsing comma-separated IDs
                            const bookIds = bookIdsStr.split(',').map(id => id.trim()).filter(id => id);

                            // Mock creation of a new order
                            const newOrderId = `O${Math.floor(Math.random() * 100000)}`;
                            responseData = {
                                success: true,
                                message: 'Order created successfully.',
                                orderId: newOrderId,
                                bookIds,
                                status: 'pending',
                            };
                            break;
                        }
                        //--------------------------------------------------------
                        //     UPDATE ORDER
                        //--------------------------------------------------------
                        case 'updateOrder': {
                            const orderId = this.getNodeParameter('orderId', itemIndex) as string;
                            const newStatus = this.getNodeParameter('newStatus', itemIndex) as string;

                            // Mock update
                            responseData = {
                                success: true,
                                message: `Order ${orderId} updated to status "${newStatus}".`,
                                orderId,
                                newStatus,
                            };
                            break;
                        }
                        default:
                            throw new Error(`Unsupported Order operation: ${operation}`);
                    }
                } else {
                    throw new Error(`Unsupported resource: ${resource}`);
                }
            } catch (error) {
                throw new Error(`Bookstore error: ${error}`);
            }

            // Push the item data to the return array
            returnData.push({
                json: responseData,
            });
        }

        return [returnData];
    }
}

